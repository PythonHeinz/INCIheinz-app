/* Minimaler QR-Code-Generator (Byte-Modus, Fehlerkorrektur M, Versionen 1-10).
   Eigenentwicklung ohne Abhängigkeiten, damit die App offline und ohne Fremdcode läuft. */
(function (root) {
  'use strict';

  // Datenwörter und Blockaufbau für Fehlerkorrektur M, Version 1-10
  // [ecPerBlock, [[anzahlBlöcke, datenwörterProBlock], ...]]
  var BLOCKS = {
    1: [10, [[1, 16]]],
    2: [16, [[1, 28]]],
    3: [26, [[1, 44]]],
    4: [18, [[2, 32]]],
    5: [24, [[2, 43]]],
    6: [16, [[4, 27]]],
    7: [18, [[4, 31]]],
    8: [22, [[2, 38], [2, 39]]],
    9: [22, [[3, 36], [2, 37]]],
    10: [26, [[4, 43], [1, 44]]]
  };
  var ALIGN = {
    1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
    7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
  };
  var REMAINDER = { 1: 0, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7, 7: 0, 8: 0, 9: 0, 10: 0 };

  // --- Galois-Feld GF(256) ---
  var EXP = new Array(512), LOG = new Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1; if (x & 0x100) x ^= 0x11d;
    }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();
  function gmul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  function rsGenerator(deg) {
    var poly = [1];
    for (var i = 0; i < deg; i++) {
      var next = new Array(poly.length + 1).fill(0);
      for (var j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gmul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly; // höchstes Glied zuerst
  }
  function rsEncode(data, ecLen) {
    var gen = rsGenerator(ecLen);
    var res = data.slice().concat(new Array(ecLen).fill(0));
    for (var i = 0; i < data.length; i++) {
      var coef = res[i];
      if (coef !== 0) {
        for (var j = 0; j < gen.length; j++) res[i + j] ^= gmul(gen[j], coef);
      }
    }
    return res.slice(data.length);
  }

  function utf8Bytes(str) {
    var out = [];
    var enc = unescape(encodeURIComponent(str));
    for (var i = 0; i < enc.length; i++) out.push(enc.charCodeAt(i));
    return out;
  }

  function dataCapacity(version) {
    var b = BLOCKS[version], n = 0;
    b[1].forEach(function (g) { n += g[0] * g[1]; });
    return n;
  }

  function buildCodewords(bytes, version) {
    var cap = dataCapacity(version);
    var bits = [];
    function put(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); }
    put(4, 4);                              // Byte-Modus
    put(bytes.length, version >= 10 ? 16 : 8);
    bytes.forEach(function (b) { put(b, 8); });
    var capBits = cap * 8;
    for (var t = 0; t < 4 && bits.length < capBits; t++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var cw = [];
    for (var i = 0; i < bits.length; i += 8) {
      var v = 0; for (var k = 0; k < 8; k++) v = (v << 1) | bits[i + k];
      cw.push(v);
    }
    var pad = [0xEC, 0x11], pi = 0;
    while (cw.length < cap) cw.push(pad[pi++ % 2]);

    // Blöcke bilden, Fehlerkorrektur berechnen, verschachteln
    var spec = BLOCKS[version], ecLen = spec[0], blocks = [], pos = 0;
    spec[1].forEach(function (g) {
      for (var n = 0; n < g[0]; n++) {
        var d = cw.slice(pos, pos + g[1]); pos += g[1];
        blocks.push({ data: d, ec: rsEncode(d, ecLen) });
      }
    });
    var out = [], maxData = 0;
    blocks.forEach(function (b) { if (b.data.length > maxData) maxData = b.data.length; });
    for (var i2 = 0; i2 < maxData; i2++) blocks.forEach(function (b) { if (i2 < b.data.length) out.push(b.data[i2]); });
    for (var j = 0; j < ecLen; j++) blocks.forEach(function (b) { out.push(b.ec[j]); });
    return out;
  }

  function bchDigit(x) { var d = 0; while (x !== 0) { d++; x >>>= 1; } return d; }
  function bchFormat(data) {
    var G = 0x537, d = data << 10;
    while (bchDigit(d) - bchDigit(G) >= 0) d ^= (G << (bchDigit(d) - bchDigit(G)));
    return ((data << 10) | d) ^ 0x5412;
  }
  function bchVersion(data) {
    var G = 0x1f25, d = data << 12;
    while (bchDigit(d) - bchDigit(G) >= 0) d ^= (G << (bchDigit(d) - bchDigit(G)));
    return (data << 12) | d;
  }

  var MASKS = [
    function (i, j) { return (i + j) % 2 === 0; },
    function (i, j) { return i % 2 === 0; },
    function (i, j) { return j % 3 === 0; },
    function (i, j) { return (i + j) % 3 === 0; },
    function (i, j) { return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0; },
    function (i, j) { return (i * j) % 2 + (i * j) % 3 === 0; },
    function (i, j) { return ((i * j) % 2 + (i * j) % 3) % 2 === 0; },
    function (i, j) { return ((i * j) % 3 + (i + j) % 2) % 2 === 0; }
  ];

  function makeMatrix(version, codewords, mask) {
    var size = version * 4 + 17, i, j;
    var m = [], fn = []; // fn: Funktionsmodul (nicht maskieren)
    for (i = 0; i < size; i++) { m.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }

    function setF(r, c, v) { if (r >= 0 && r < size && c >= 0 && c < size) { m[r][c] = v; fn[r][c] = true; } }

    function finder(r, c) {
      for (var y = -1; y <= 7; y++) for (var x = -1; x <= 7; x++) {
        var inside = (y >= 0 && y <= 6 && (x === 0 || x === 6)) ||
                     (x >= 0 && x <= 6 && (y === 0 || y === 6)) ||
                     (y >= 2 && y <= 4 && x >= 2 && x <= 4);
        setF(r + y, c + x, inside);
      }
    }
    finder(0, 0); finder(0, size - 7); finder(size - 7, 0);

    // Timing
    for (i = 8; i < size - 8; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }

    // Ausrichtungsmuster
    var al = ALIGN[version];
    for (i = 0; i < al.length; i++) for (j = 0; j < al.length; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) continue;
      var cy = al[i], cx = al[j];
      for (var y = -2; y <= 2; y++) for (var x = -2; x <= 2; x++) {
        setF(cy + y, cx + x, Math.max(Math.abs(x), Math.abs(y)) !== 1);
      }
    }

    // Formatinformation (Fehlerkorrektur M = 00)
    var fbits = bchFormat((0 << 3) | mask);
    for (i = 0; i < 15; i++) {
      var bit = ((fbits >> i) & 1) === 1;
      if (i < 6) setF(i, 8, bit); else if (i < 8) setF(i + 1, 8, bit); else setF(size - 15 + i, 8, bit);
      if (i < 8) setF(8, size - i - 1, bit); else if (i < 9) setF(8, 15 - i, bit); else setF(8, 15 - i - 1, bit);
    }
    setF(size - 8, 8, true); // dunkles Modul

    // Versionsinformation
    if (version >= 7) {
      var vbits = bchVersion(version);
      for (i = 0; i < 18; i++) {
        var vb = ((vbits >> i) & 1) === 1;
        setF(Math.floor(i / 3), i % 3 + size - 11, vb);
        setF(i % 3 + size - 11, Math.floor(i / 3), vb);
      }
    }

    // Daten platzieren (Zickzack von rechts unten)
    var bitIdx = 0, total = codewords.length * 8 + REMAINDER[version];
    function dataBit() {
      if (bitIdx >= codewords.length * 8) { bitIdx++; return false; }
      var b = (codewords[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1; bitIdx++; return b === 1;
    }
    var up = true;
    for (var col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      for (var k = 0; k < size; k++) {
        var row = up ? size - 1 - k : k;
        for (var d = 0; d < 2; d++) {
          var cc = col - d;
          if (fn[row][cc]) continue;
          var v = dataBit();
          if (MASKS[mask](row, cc)) v = !v;
          m[row][cc] = v;
        }
      }
      up = !up;
    }
    return m;
  }

  function penalty(m) {
    var size = m.length, score = 0, i, j, run, cnt;
    // Regel 1: Reihen/Spalten gleicher Farbe
    for (var dir = 0; dir < 2; dir++) {
      for (i = 0; i < size; i++) {
        run = 1;
        for (j = 1; j < size; j++) {
          var a = dir ? m[j][i] : m[i][j], b = dir ? m[j - 1][i] : m[i][j - 1];
          if (a === b) { run++; } else { if (run >= 5) score += run - 2; run = 1; }
        }
        if (run >= 5) score += run - 2;
      }
    }
    // Regel 2: 2x2-Blöcke
    for (i = 0; i < size - 1; i++) for (j = 0; j < size - 1; j++) {
      var c = m[i][j];
      if (c === m[i][j + 1] && c === m[i + 1][j] && c === m[i + 1][j + 1]) score += 3;
    }
    // Regel 3: Finder-ähnliche Muster
    var pat1 = [true, false, true, true, true, false, true, false, false, false, false];
    var pat2 = [false, false, false, false, true, false, true, true, true, false, true];
    for (i = 0; i < size; i++) for (j = 0; j <= size - 11; j++) {
      var m1 = true, m2 = true, m3 = true, m4 = true;
      for (var k = 0; k < 11; k++) {
        if (m[i][j + k] !== pat1[k]) m1 = false;
        if (m[i][j + k] !== pat2[k]) m2 = false;
        if (m[j + k][i] !== pat1[k]) m3 = false;
        if (m[j + k][i] !== pat2[k]) m4 = false;
      }
      if (m1) score += 40; if (m2) score += 40; if (m3) score += 40; if (m4) score += 40;
    }
    // Regel 4: Anteil dunkler Module
    cnt = 0; for (i = 0; i < size; i++) for (j = 0; j < size; j++) if (m[i][j]) cnt++;
    var pct = cnt * 100 / (size * size);
    score += Math.floor(Math.abs(pct - 50) / 5) * 10;
    return score;
  }

  function make(text) {
    var bytes = utf8Bytes(text), version = 0;
    for (var v = 1; v <= 10; v++) {
      var need = 4 + (v >= 10 ? 16 : 8) + bytes.length * 8;
      if (need <= dataCapacity(v) * 8) { version = v; break; }
    }
    if (!version) throw new Error('Text zu lang für den QR-Code (max. ca. 210 Zeichen)');
    var cw = buildCodewords(bytes, version), best = null, bestScore = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var mm = makeMatrix(version, cw, mask), s = penalty(mm);
      if (s < bestScore) { bestScore = s; best = mm; }
    }
    return { version: version, size: best.length, modules: best };
  }

  // SVG mit einem einzigen Pfad; margin = Ruhezone in Modulen (Standard 4)
  function toSVG(text, opts) {
    opts = opts || {};
    var margin = opts.margin == null ? 4 : opts.margin;
    var q = make(text), n = q.size, d = '';
    for (var r = 0; r < n; r++) {
      var c = 0;
      while (c < n) {
        if (q.modules[r][c]) {
          var start = c; while (c < n && q.modules[r][c]) c++;
          d += 'M' + (start + margin) + ',' + (r + margin) + 'h' + (c - start) + 'v1h-' + (c - start) + 'z';
        } else c++;
      }
    }
    var dim = n + margin * 2;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dim + ' ' + dim + '" shape-rendering="crispEdges" role="img" aria-label="QR-Code">' +
      '<rect width="' + dim + '" height="' + dim + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  }

  var api = { make: make, toSVG: toSVG };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.QR = api;
})(typeof window !== 'undefined' ? window : globalThis);
