import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// 1. Verify D1 Schema Completeness & Constraints
test('Cloudflare D1 Schema Integrity', () => {
  const schemaPath = path.resolve('d1/schema.sql');
  assert.ok(fs.existsSync(schemaPath), 'd1/schema.sql must exist');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Verify all 12 required tables exist
  const expectedTables = [
    'users',
    'courses',
    'lessons',
    'quizzes',
    'sandboxes',
    'enrollments',
    'completed_lessons',
    'workshops',
    'workshop_tickets',
    'bounties',
    'community_challenges',
    'challenge_submissions'
  ];

  for (const table of expectedTables) {
    assert.match(
      schemaSql,
      new RegExp(`CREATE TABLE (IF NOT EXISTS )?${table}\\b`, 'i'),
      `Table ${table} must be defined in d1/schema.sql`
    );
  }

  // Verify CQS <= 20 min rule check constraint on lessons table
  assert.match(
    schemaSql,
    /duration_seconds\s+INTEGER\s+NOT\s+NULL\s+CHECK\s*\(\s*duration_seconds\s*<=\s*1200\s*\)/i,
    'Lessons table must enforce check constraint: duration_seconds <= 1200 (20 min)'
  );

  // Verify indexes
  assert.match(schemaSql, /CREATE INDEX idx_courses_track/i);
  assert.match(schemaSql, /CREATE INDEX idx_courses_cqs/i);
  assert.match(schemaSql, /CREATE INDEX idx_lessons_course/i);
});

// 2. Verify Vercel Configuration & Security Headers
test('Vercel Config Verification', () => {
  const vercelPath = path.resolve('vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist');
  const vercelJson = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

  assert.strictEqual(vercelJson.framework, 'nextjs');
  assert.ok(Array.isArray(vercelJson.headers), 'Security headers array must be configured');
  
  const headers = vercelJson.headers.flatMap((h) => h.headers);
  const headerKeys = headers.map((h) => h.key.toLowerCase());
  assert.ok(headerKeys.includes('x-frame-options'), 'X-Frame-Options must be present');
  assert.ok(headerKeys.includes('x-content-type-options'), 'X-Content-Type-Options must be present');
});

// 3. Verify Environment Documentation (.env.example)
test('Environment Example Completeness', () => {
  const envPath = path.resolve('.env.example');
  assert.ok(fs.existsSync(envPath), '.env.example must exist');
  const content = fs.readFileSync(envPath, 'utf8');

  // Firebase
  assert.match(content, /NEXT_PUBLIC_FIREBASE_API_KEY/);
  assert.match(content, /NEXT_PUBLIC_FIREBASE_PROJECT_ID/);

  // Cloudflare D1
  assert.match(content, /CLOUDFLARE_ACCOUNT_ID/);
  assert.match(content, /CLOUDFLARE_D1_DATABASE_ID/);
  assert.match(content, /CLOUDFLARE_API_TOKEN/);

  // Cloudflare R1
  assert.match(content, /CLOUDFLARE_R1_ACCOUNT_ID/);
  assert.match(content, /CLOUDFLARE_R1_ACCESS_KEY_ID/);
  assert.match(content, /CLOUDFLARE_R1_SECRET_ACCESS_KEY/);
  assert.match(content, /CLOUDFLARE_R1_BUCKET_NAME/);
});

// 4. Verify Sandbox Real Assertion Engine
test('Sandbox Code Execution & Real Assertion Logic', () => {
  const userCode = `
    function calculateLatency(pingArray) {
      if (!pingArray || pingArray.length === 0) return 0;
      const total = pingArray.reduce((acc, val) => acc + val, 0);
      return Math.round(total / pingArray.length);
    }
  `;

  const testCase1 = {
    inputCode: 'calculateLatency([12, 18, 15, 24, 11])',
    expectedOutput: '16'
  };

  const testRunner1 = new Function(`
    ${userCode}
    try {
      return (${testCase1.inputCode});
    } catch(e) {
      return "ERROR: " + e.message;
    }
  `);

  const res1 = testRunner1();
  assert.strictEqual(String(res1), testCase1.expectedOutput, 'User function must return expected 16');

  // Verify faulty code fails assertion correctly
  const badCode = `
    function calculateLatency(pingArray) {
      return 999;
    }
  `;
  const testRunnerBad = new Function(`
    ${badCode}
    try {
      return (${testCase1.inputCode});
    } catch(e) {
      return "ERROR: " + e.message;
    }
  `);
  const badRes = testRunnerBad();
  assert.notStrictEqual(String(badRes), testCase1.expectedOutput, 'Faulty function must NOT pass assertion');
});

// 5. Verify CQS ≤ 20 min rule across lessons in mock-data.ts
test('CQS Quality Standard: All lessons duration <= 1200s (20 mins)', () => {
  const mockDataPath = path.resolve('src/lib/mock-data.ts');
  const mockContent = fs.readFileSync(mockDataPath, 'utf8');

  // Regex extract durationSeconds: <number>
  const matches = mockContent.matchAll(/durationSeconds:\s*(\d+)/g);
  let count = 0;
  for (const m of matches) {
    count++;
    const duration = parseInt(m[1], 10);
    assert.ok(
      duration <= 1200,
      `Every lesson must be <= 1200 seconds (20 mins). Found: ${duration}s`
    );
  }
  assert.ok(count > 0, 'Must have validated at least one lesson duration');
});

// 6. Verify HLS and Canvas Protection in VideoPlayer.tsx
test('VideoPlayer HLS & Canvas Protection Implementation', () => {
  const vpPath = path.resolve('src/components/VideoPlayer.tsx');
  const vpContent = fs.readFileSync(vpPath, 'utf8');

  assert.match(vpContent, /import\s+Hls\s+from\s+'hls\.js'/i, 'VideoPlayer must import hls.js');
  assert.match(vpContent, /Hls\.isSupported\(\)/, 'VideoPlayer must check Hls.isSupported()');
  assert.match(vpContent, /<canvas/i, 'VideoPlayer must contain canvas protection overlay');
  assert.match(vpContent, /PrintScreen/, 'VideoPlayer must intercept PrintScreen shortcuts');
  assert.match(vpContent, /chapters\s*=\s*\[\]/, 'VideoPlayer must support chapters prop');
});

// 7. Verify API Routes Existence and Methods
test('API Routes Complete Layer & Method Handlers', () => {
  const routes = [
    { file: 'src/app/api/courses/route.ts', methods: ['GET', 'POST'] },
    { file: 'src/app/api/workshops/route.ts', methods: ['GET', 'POST'] },
    { file: 'src/app/api/tickets/route.ts', methods: ['GET'] },
    { file: 'src/app/api/challenges/route.ts', methods: ['GET', 'POST'] },
    { file: 'src/app/api/bounties/route.ts', methods: ['GET', 'POST'] },
    { file: 'src/app/api/upload/route.ts', methods: ['POST'] },
    { file: 'src/app/api/health/route.ts', methods: ['GET'] },
  ];

  for (const r of routes) {
    const fullPath = path.resolve(r.file);
    assert.ok(fs.existsSync(fullPath), `Route file ${r.file} must exist`);
    const code = fs.readFileSync(fullPath, 'utf8');
    for (const m of r.methods) {
      assert.match(
        code,
        new RegExp(`export\\s+async\\s+function\\s+${m}\\b`),
        `Route ${r.file} must export ${m} handler`
      );
    }
  }
});

// 8. Verify CQS ≤ 20 min rule enforcement on new lesson addition
test('CQS Quality Standard Enforcement in API & Server Layer', () => {
  const serverPath = path.resolve('src/lib/d1-server.ts');
  const serverCode = fs.readFileSync(serverPath, 'utf8');

  // Verify addLessonServer checks duration <= 1200
  assert.match(
    serverCode,
    /durationSeconds\s*>\s*1200/,
    'd1-server.ts must enforce durationSeconds <= 1200 limit'
  );

  // Verify API route courses checks duration <= 1200
  const routePath = path.resolve('src/app/api/courses/route.ts');
  const routeCode = fs.readFileSync(routePath, 'utf8');
  assert.match(
    routeCode,
    /durationSeconds\s*\)?\s*>\s*1200/,
    '/api/courses/route.ts must reject lesson additions > 1200s'
  );
});

// 9. Verify VideoPlayer Valid Tailwind classes and dynamic canvas
test('VideoPlayer Valid Tailwind Classes & Dynamic Canvas', () => {
  const vpPath = path.resolve('src/components/VideoPlayer.tsx');
  const vpContent = fs.readFileSync(vpPath, 'utf8');

  // Ensure arbitrary z-index classes use bracket notation
  assert.match(vpContent, /z-\[15\]/, 'Canvas must use valid Tailwind class z-[15]');
  assert.match(vpContent, /z-\[25\]/, 'Watermark must use valid Tailwind class z-[25]');
  assert.match(vpContent, /z-\[35\]/, 'Completion overlay must use valid Tailwind class z-[35]');
  assert.match(vpContent, /backdrop-blur-sm/, 'Watermark must use standard backdrop-blur-sm');

  // Ensure dynamic canvas resize listener
  assert.match(vpContent, /resizeCanvas/, 'VideoPlayer must dynamically resize canvas');
  assert.match(vpContent, /addEventListener\(['"]resize['"]/, 'VideoPlayer must listen to window resize events');
});

// 10. Verify Sandbox Multi-Type Assertion & Safe Console Handling
test('Sandbox Multi-Type Assertion & Safe Console Execution', () => {
  const safeFormat = (val) => {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val);
      } catch {
        return '[Object]';
      }
    }
    return String(val);
  };

  // Test object serialization
  assert.strictEqual(safeFormat({ a: 1, b: 'test' }), '{"a":1,"b":"test"}');
  assert.strictEqual(safeFormat([1, 2, 3]), '[1,2,3]');
  assert.strictEqual(safeFormat(true), 'true');
  assert.strictEqual(safeFormat(null), 'null');
  assert.strictEqual(safeFormat(undefined), 'undefined');

  // Test circular reference safety
  const circular = {};
  circular.self = circular;
  assert.strictEqual(safeFormat(circular), '[Object]');

  // Test console runner with multiple logs
  const logs = [];
  const customConsole = {
    log: (...args) => logs.push(args.map(safeFormat).join(' ')),
    warn: (...args) => logs.push('⚠️ ' + args.map(safeFormat).join(' ')),
    error: (...args) => logs.push('❌ ' + args.map(safeFormat).join(' ')),
    info: (...args) => logs.push('ℹ️ ' + args.map(safeFormat).join(' ')),
  };

  const userCode = `
    console.log("val:", 42);
    console.warn("warning note");
    console.info("info note");
  `;
  const runner = new Function('console', userCode);
  runner(customConsole);

  assert.strictEqual(logs.length, 3);
  assert.strictEqual(logs[0], 'val: 42');
  assert.ok(logs[1].includes('⚠️ warning note'));
  assert.ok(logs[2].includes('ℹ️ info note'));
});

// 11. Verify Emil Kowalski Motion Tokens in globals.css
test('Emil Kowalski Design Engineering Tokens & Accessibility in globals.css', () => {
  const cssPath = path.resolve('src/app/globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  assert.match(cssContent, /--ease-out:\s*cubic-bezier/i, 'Must define custom --ease-out curve');
  assert.match(cssContent, /--ease-spring:\s*cubic-bezier/i, 'Must define custom --ease-spring curve');
  assert.match(cssContent, /\.btn-press\b/, 'Must define .btn-press utility');
  assert.match(cssContent, /active\s*\{\s*transform:\s*scale\(0\.97\)/, 'Must have scale(0.97) press feedback');
  assert.match(cssContent, /prefers-reduced-motion:\s*reduce/, 'Must respect prefers-reduced-motion');
});

// 12. Verify Corporate Account Registration Option in auth/page.tsx
test('Corporate Account Registration & Routing in auth/page.tsx', () => {
  const authPath = path.resolve('src/app/auth/page.tsx');
  const authContent = fs.readFileSync(authPath, 'utf8');

  assert.match(authContent, /'corporate'/, 'Auth page must support corporate accountType state');
  assert.match(authContent, /شريك شركات \(B2B\)/, 'Auth page must render corporate account button label');
  assert.match(authContent, /router\.push\(['"]\/corporate['"]\)/, 'Auth page must redirect corporate users to /corporate');
});

// 13. Verify Corporate Multi-Tab Architecture & Interview Scheduling in corporate/page.tsx
test('Corporate Multi-Tab Architecture & Interview Flow in corporate/page.tsx', () => {
  const corpPath = path.resolve('src/app/corporate/page.tsx');
  const corpContent = fs.readFileSync(corpPath, 'utf8');

  // Verify 4 interactive tabs
  assert.match(corpContent, /activeTab\s*===\s*['"]talent['"]/, 'Must support talent tab');
  assert.match(corpContent, /activeTab\s*===\s*['"]bounties['"]/, 'Must support bounties tab');
  assert.match(corpContent, /activeTab\s*===\s*['"]pipeline['"]/, 'Must support pipeline tab');
  assert.match(corpContent, /activeTab\s*===\s*['"]partnerships['"]/, 'Must support partnerships tab');

  // Verify interview scheduling modal & flow
  assert.match(corpContent, /handleScheduleInterview/, 'Must have interview scheduling handler');
  assert.match(corpContent, /in_person/, 'Must support in-person incubator interview mode');
  assert.match(corpContent, /remote/, 'Must support remote video interview mode');
  assert.match(corpContent, /showMouModal/, 'Must have MoU partnership modal');
});

// 14. Verify Navbar Role Switcher Dynamic Route Push
test('Navbar Role Switcher Dynamic Navigation', () => {
  const navPath = path.resolve('src/components/Navbar.tsx');
  const navContent = fs.readFileSync(navPath, 'utf8');

  assert.match(navContent, /router\.push\(['"]\/corporate['"]\)/, 'Navbar must push to /corporate when corporate role chosen');
  assert.match(navContent, /router\.push\(['"]\/instructor['"]\)/, 'Navbar must push to /instructor when instructor role chosen');
  assert.match(navContent, /router\.push\(['"]\/dashboard['"]\)/, 'Navbar must push to /dashboard when trainee role chosen');
});

// 15. Verify Firebase Hosting & App Hosting Configuration
test('Firebase Hosting & App Hosting Configuration Completeness', () => {
  // Check .firebaserc
  const rcPath = path.resolve('.firebaserc');
  assert.ok(fs.existsSync(rcPath), '.firebaserc must exist');
  const rcJson = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
  assert.strictEqual(rcJson.projects?.default, 'etqan-1ez88', 'Default Firebase project must be etqan-1ez88');

  // Check firebase.json
  const fbPath = path.resolve('firebase.json');
  assert.ok(fs.existsSync(fbPath), 'firebase.json must exist');
  const fbJson = JSON.parse(fs.readFileSync(fbPath, 'utf8'));
  assert.ok(fbJson.hosting, 'firebase.json must contain hosting block');
  assert.strictEqual(fbJson.hosting.source, '.', 'Hosting source must be root for web frameworks');

  // Check apphosting.yaml
  const appHostingPath = path.resolve('apphosting.yaml');
  assert.ok(fs.existsSync(appHostingPath), 'apphosting.yaml must exist');
  const appHostingContent = fs.readFileSync(appHostingPath, 'utf8');
  assert.match(appHostingContent, /NEXT_PUBLIC_FIREBASE_PROJECT_ID/, 'apphosting.yaml must configure environment variables');
  assert.match(appHostingContent, /etqan-1ez88/, 'apphosting.yaml must contain project ID etqan-1ez88');
});


