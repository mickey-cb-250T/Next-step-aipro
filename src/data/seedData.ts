import { CareerTrack, Skill, SkillPrerequisite, ProjectRecommendation, InterviewQuestion, UserProfile } from '../types';

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'backend-dev',
    name: 'Backend Engineering',
    description: 'Server architectures, microservices, distributed data, transactional guarantees, and high-throughput APIs.',
    marketFocus: 'High-concurrency APIs, PostgreSQL/Redis, Docker/K8s, System Architecture, Auth & Security',
    recommendedWeeklyHours: 12,
    averageWeeksToReadiness: 16,
    coreSkills: ['prog-foundations', 'git-version-control', 'data-structures', 'sql-relational-db', 'rest-api-design', 'docker-containers', 'system-design-basics', 'testing-fundamentals']
  },
  {
    id: 'frontend-dev',
    name: 'Frontend Engineering',
    description: 'Modern component architectures, accessible user interfaces, web standards, state synchronization, and browser performance.',
    marketFocus: 'React 19/Next.js, TypeScript, State Management, Core Web Vitals, Responsive CSS, WebSockets',
    recommendedWeeklyHours: 10,
    averageWeeksToReadiness: 14,
    coreSkills: ['prog-foundations', 'git-version-control', 'typescript-foundations', 'react-architecture', 'state-management', 'web-performance', 'testing-fundamentals']
  },
  {
    id: 'fullstack-dev',
    name: 'Full-Stack Software Development',
    description: 'End-to-end product engineering spanning responsive interfaces, REST/tRPC services, cloud deployment, and persistence.',
    marketFocus: 'TypeScript, Next.js/Node.js, PostgreSQL/Drizzle, CI/CD, Authentication, Cloud Hosting',
    recommendedWeeklyHours: 14,
    averageWeeksToReadiness: 18,
    coreSkills: ['prog-foundations', 'git-version-control', 'typescript-foundations', 'react-architecture', 'sql-relational-db', 'rest-api-design', 'docker-containers', 'cloud-deployment']
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics & Engineering',
    description: 'Data transformation, dimensional modeling, automated ETL pipelines, warehouse optimization, and quantitative analytics.',
    marketFocus: 'Advanced SQL, Python (Pandas/Polars), dbt, Data Warehousing (BigQuery/Postgres), BI Dashboards',
    recommendedWeeklyHours: 10,
    averageWeeksToReadiness: 14,
    coreSkills: ['prog-foundations', 'sql-relational-db', 'advanced-sql-window', 'python-data-stack', 'data-modeling', 'data-visualization', 'git-version-control']
  },
  {
    id: 'ml-ai-engineering',
    name: 'Machine Learning & AI Engineering',
    description: 'Applied statistical modeling, neural networks, vector databases, LLM agent workflows, and production model serving.',
    marketFocus: 'Python, PyTorch, Embeddings & RAG, Model Evaluation, Fast-API Serving, Fine-Tuning',
    recommendedWeeklyHours: 14,
    averageWeeksToReadiness: 20,
    coreSkills: ['prog-foundations', 'data-structures', 'python-data-stack', 'math-linear-algebra', 'ml-fundamentals', 'vector-search-rag', 'rest-api-design']
  }
];

export const SKILLS_CATALOG: Skill[] = [
  {
    id: 'prog-foundations',
    name: 'Programming Foundations',
    category: 'Core',
    description: 'Variables, loops, control flow, functions, algorithmic thinking, recursion, and core debugging.',
    importance: 5,
    estimatedHours: 20
  },
  {
    id: 'git-version-control',
    name: 'Git & Version Control',
    category: 'Core',
    description: 'Branching strategies, pull requests, interactive rebasing, merge conflict resolution, and atomic commits.',
    importance: 4,
    estimatedHours: 10
  },
  {
    id: 'data-structures',
    name: 'Data Structures & Algorithms',
    category: 'Core',
    description: 'Hash tables, binary trees, graphs, heaps, BFS/DFS, dynamic programming, and Big-O space/time complexity.',
    importance: 5,
    estimatedHours: 35
  },
  {
    id: 'typescript-foundations',
    name: 'TypeScript & Static Typing',
    category: 'Frontend',
    description: 'Generics, union types, type guards, type narrowing, inference, utility types, and tsconfig strict mode.',
    importance: 5,
    estimatedHours: 18
  },
  {
    id: 'react-architecture',
    name: 'React Component Architecture',
    category: 'Frontend',
    description: 'Virtual DOM, component lifecycles, custom hooks, memoization, Server vs Client components, and accessible patterns.',
    importance: 5,
    estimatedHours: 25
  },
  {
    id: 'state-management',
    name: 'State Management & Sync',
    category: 'Frontend',
    description: 'Context, server-state caching (TanStack Query/SWR), client stores (Zustand), and optimistic UI updates.',
    importance: 4,
    estimatedHours: 15
  },
  {
    id: 'web-performance',
    name: 'Web Performance & Core Vitals',
    category: 'Frontend',
    description: 'LCP/INP/CLS metrics, code-splitting, bundle analysis, image optimization, tree-shaking, and lazy hydration.',
    importance: 3,
    estimatedHours: 12
  },
  {
    id: 'sql-relational-db',
    name: 'SQL & Relational Databases',
    category: 'Databases',
    description: 'Schema modeling, relational normalization (3NF), foreign keys, complex joins, subqueries, and ACID transactions.',
    importance: 5,
    estimatedHours: 25
  },
  {
    id: 'advanced-sql-window',
    name: 'Advanced SQL & Query Optimization',
    category: 'Databases',
    description: 'Window functions (ROW_NUMBER, LAG, LEAD), B-Tree & GIN indexing, EXPLAIN ANALYZE query plans, and CTEs.',
    importance: 4,
    estimatedHours: 20
  },
  {
    id: 'rest-api-design',
    name: 'REST API Architecture',
    category: 'Backend',
    description: 'HTTP semantics, idempotency, status code contracts, validation middlewares, pagination, and rate limiting headers.',
    importance: 5,
    estimatedHours: 20
  },
  {
    id: 'auth-security',
    name: 'Authentication & Web Security',
    category: 'Backend',
    description: 'JWT tokens, refresh cookies (HttpOnly, SameSite), OAuth 2.0 PKCE flows, RBAC role authorization, and CSRF/CORS.',
    importance: 4,
    estimatedHours: 18
  },
  {
    id: 'docker-containers',
    name: 'Containerization with Docker',
    category: 'DevOps',
    description: 'Multi-stage Dockerfiles, image size minimization, docker-compose orchestration, environment secrets, and volumes.',
    importance: 4,
    estimatedHours: 14
  },
  {
    id: 'cloud-deployment',
    name: 'Cloud Deployment & CI/CD',
    category: 'DevOps',
    description: 'Automated GitHub Actions workflows, lint/test pipelines, container registries, Cloud Run / Vercel hosting, and environment variables.',
    importance: 4,
    estimatedHours: 16
  },
  {
    id: 'system-design-basics',
    name: 'System Design & Scalability',
    category: 'Architecture',
    description: 'Horizontal vs vertical scaling, load balancers, caching layers (Redis), database sharding/replication, and CAP theorem.',
    importance: 4,
    estimatedHours: 22
  },
  {
    id: 'testing-fundamentals',
    name: 'Automated Testing (Unit & E2E)',
    category: 'Quality',
    description: 'Unit testing with Vitest/Jest, mocking external APIs, integration tests with testcontainers, and end-to-end user flows.',
    importance: 4,
    estimatedHours: 18
  },
  {
    id: 'python-data-stack',
    name: 'Python for Data & Analytics',
    category: 'AI/Data',
    description: 'NumPy vectorized computation, Pandas/Polars DataFrame manipulation, missing data imputation, and exploratory data analysis.',
    importance: 5,
    estimatedHours: 24
  },
  {
    id: 'data-modeling',
    name: 'Data Warehousing & Dimensional Modeling',
    category: 'Databases',
    description: 'Star vs Snowflake schemas, fact and dimension tables, slowly changing dimensions (SCD), and dbt transformation workflows.',
    importance: 4,
    estimatedHours: 20
  },
  {
    id: 'data-visualization',
    name: 'Quantitative Data Visualization',
    category: 'AI/Data',
    description: 'Visual communication of distributions, time-series forecasting trends, cohort retention heatmaps, and dashboard UX.',
    importance: 3,
    estimatedHours: 12
  },
  {
    id: 'math-linear-algebra',
    name: 'Applied Math & Linear Algebra',
    category: 'Core',
    description: 'Vectors, matrix multiplications, dot products, cosine similarities, probability distributions, and gradient descent intuition.',
    importance: 4,
    estimatedHours: 20
  },
  {
    id: 'ml-fundamentals',
    name: 'Machine Learning Foundations',
    category: 'AI/Data',
    description: 'Supervised vs unsupervised learning, bias-variance tradeoff, cross-validation, regularization (L1/L2), and evaluation metrics (F1, ROC-AUC).',
    importance: 5,
    estimatedHours: 28
  },
  {
    id: 'vector-search-rag',
    name: 'Vector Search & RAG Architectures',
    category: 'AI/Data',
    description: 'Dense vector embeddings, approximate nearest neighbors (HNSW), chunking strategies, hybrid search, and context groundings.',
    importance: 5,
    estimatedHours: 22
  }
];

export const SKILL_PREREQUISITES: SkillPrerequisite[] = [
  { skillId: 'data-structures', prerequisiteId: 'prog-foundations', strength: 'required' },
  { skillId: 'typescript-foundations', prerequisiteId: 'prog-foundations', strength: 'required' },
  { skillId: 'react-architecture', prerequisiteId: 'typescript-foundations', strength: 'required' },
  { skillId: 'state-management', prerequisiteId: 'react-architecture', strength: 'required' },
  { skillId: 'web-performance', prerequisiteId: 'react-architecture', strength: 'recommended' },
  { skillId: 'rest-api-design', prerequisiteId: 'prog-foundations', strength: 'required' },
  { skillId: 'auth-security', prerequisiteId: 'rest-api-design', strength: 'required' },
  { skillId: 'sql-relational-db', prerequisiteId: 'prog-foundations', strength: 'required' },
  { skillId: 'advanced-sql-window', prerequisiteId: 'sql-relational-db', strength: 'required' },
  { skillId: 'docker-containers', prerequisiteId: 'git-version-control', strength: 'recommended' },
  { skillId: 'cloud-deployment', prerequisiteId: 'docker-containers', strength: 'recommended' },
  { skillId: 'cloud-deployment', prerequisiteId: 'git-version-control', strength: 'required' },
  { skillId: 'system-design-basics', prerequisiteId: 'sql-relational-db', strength: 'required' },
  { skillId: 'system-design-basics', prerequisiteId: 'rest-api-design', strength: 'required' },
  { skillId: 'testing-fundamentals', prerequisiteId: 'prog-foundations', strength: 'required' },
  { skillId: 'python-data-stack', prerequisiteId: 'prog-foundations', strength: 'required' },
  { skillId: 'data-modeling', prerequisiteId: 'sql-relational-db', strength: 'required' },
  { skillId: 'data-visualization', prerequisiteId: 'python-data-stack', strength: 'recommended' },
  { skillId: 'ml-fundamentals', prerequisiteId: 'python-data-stack', strength: 'required' },
  { skillId: 'ml-fundamentals', prerequisiteId: 'math-linear-algebra', strength: 'required' },
  { skillId: 'vector-search-rag', prerequisiteId: 'ml-fundamentals', strength: 'recommended' },
  { skillId: 'vector-search-rag', prerequisiteId: 'rest-api-design', strength: 'required' }
];

export const CURATED_PROJECTS: ProjectRecommendation[] = [
  {
    id: 'distributed-rate-limiter',
    title: 'Distributed Token-Bucket API Gateway & Rate Limiter',
    careerTrackId: 'backend-dev',
    difficulty: 'Intermediate',
    category: 'Backend Infrastructure & Distributed Systems',
    problemStatement: 'Unprotected APIs face distributed DDoS attacks, aggressive web scrapers, and tenant resource starvation without deterministic request throttling.',
    whyItMatters: 'Demonstrates distributed concurrency control, Redis atomic Lua scripts, latency budgets, and RFC-standardized HTTP 429 Retry-After headers to hiring managers.',
    techStack: ['Node.js/TypeScript or Go', 'Redis', 'Docker Compose', 'k6 Load Testing'],
    milestones: [
      { title: 'In-Memory Token Bucket', target: 'Implement local thread-safe leaky/token bucket algorithm with sliding window tests', hours: 4 },
      { title: 'Atomic Redis Lua Scripting', target: 'Migrate counter logic to Redis Lua to eliminate distributed race conditions', hours: 6 },
      { title: 'Express / Fastify Middleware Integration', target: 'Inject headers (X-RateLimit-Limit, Remaining, Reset) with customizable IP/API-key quotas', hours: 4 },
      { title: 'Load & Chaos Benchmarking', target: 'Write k6 test scripts running 3,000 req/sec to prove 99th percentile latency < 5ms under contention', hours: 6 }
    ],
    testingRequirements: 'Unit tests for sliding window math; integration tests against ephemeral Redis container; k6 load test script verifying graceful 429 degradation under load.',
    deliverables: [
      'Clean Git repository with modular package layout',
      'docker-compose.yml running Redis and application service',
      'Comprehensive README with architecture diagram and benchmark throughput charts'
    ],
    developedSkills: ['rest-api-design', 'docker-containers', 'testing-fundamentals', 'system-design-basics'],
    status: 'in_progress',
    githubUrl: 'https://github.com/developer/distributed-rate-limiter'
  },
  {
    id: 'realtime-collaborative-canvas',
    title: 'Realtime Conflict-Free Collaborative Document Editor',
    careerTrackId: 'frontend-dev',
    difficulty: 'Advanced',
    category: 'Frontend Engineering & Real-time Systems',
    problemStatement: 'Multi-user editing tools cause lost overwrites and jarring cursor jumps without conflict-free distributed synchronization primitives.',
    whyItMatters: 'Proves advanced mastery of browser rendering, WebSockets, operational transformation or CRDT (Conflict-free Replicated Data Types) structures, and accessible UI patterns.',
    techStack: ['React 19', 'TypeScript', 'Yjs / Automerge', 'WebSockets', 'Tailwind CSS'],
    milestones: [
      { title: 'WebSocket State Synchronization', target: 'Build bidirectional Node/WS gateway with connection heartbeat and reconnection backoff', hours: 5 },
      { title: 'CRDT Shared State Binding', target: 'Integrate Yjs shared text document structure with optimistic local mutation', hours: 7 },
      { title: 'Multi-User Awareness & Presence', target: 'Render live multi-client cursors, selection highlights, and user color avatars with zero layout shift', hours: 5 },
      { title: 'Offline Resilience & Recovery', target: 'Cache documents in IndexedDB and reconcile changes automatically upon network reconnect', hours: 6 }
    ],
    testingRequirements: 'Playwright end-to-end tests simulating two concurrent browser sessions typing simultaneously into identical paragraphs without dropping keystrokes.',
    deliverables: [
      'Production-ready React 19 app with responsive sidebar and outline view',
      'Live deployment preview link with WebSocket server',
      'Technical writeup explaining why CRDT was chosen over operational transform'
    ],
    developedSkills: ['typescript-foundations', 'react-architecture', 'state-management', 'testing-fundamentals'],
    status: 'saved'
  },
  {
    id: 'financial-etl-pipeline',
    title: 'Idempotent Financial Tick Ingestion & Metric Mart',
    careerTrackId: 'data-analytics',
    difficulty: 'Intermediate',
    category: 'Data Engineering & Analytics',
    problemStatement: 'Raw market trading streams arrive out-of-order with duplicate ticks, requiring strictly idempotent transformation into analytical daily aggregations.',
    whyItMatters: 'Demonstrates real-world data warehousing: surrogate keys, slowly changing dimensions, window functions, and automated data quality assertions.',
    techStack: ['Python', 'PostgreSQL / DuckDB', 'dbt (data build tool)', 'GitHub Actions'],
    milestones: [
      { title: 'Raw Ingestion Pipeline', target: 'Fetch and stage raw market JSON records with MD5 deduplication hashing', hours: 4 },
      { title: 'dbt Dimensional Modeling', target: 'Build staging, intermediate, and mart models computing 7-day rolling VWAP (Volume-Weighted Average Price)', hours: 7 },
      { title: 'Automated Quality Test Assertions', target: 'Write dbt tests enforcing column uniqueness, not-null constraints, and positive price assertions', hours: 4 },
      { title: 'Interactive BI Dashboard', target: 'Visualize ticker volatility, volume distribution, and anomaly flags', hours: 5 }
    ],
    testingRequirements: 'Automated CI pipeline testing that dbt models compile and fail immediately on synthetic records containing negative prices or null timestamps.',
    deliverables: [
      'dbt documentation lineage DAG artifact',
      'Complete SQL migration scripts and reproducible seed dataset',
      'Step-by-step README explaining the star-schema design'
    ],
    developedSkills: ['sql-relational-db', 'advanced-sql-window', 'python-data-stack', 'data-modeling', 'data-visualization'],
    status: 'saved'
  },
  {
    id: 'vector-search-doc-engine',
    title: 'Hybrid Semantic Document Search & RAG Evaluation Engine',
    careerTrackId: 'ml-ai-engineering',
    difficulty: 'Advanced',
    category: 'Applied AI & Vector Systems',
    problemStatement: 'Keyword search fails on synonyms and conceptual questions, while pure vector search misses exact part numbers and acronyms.',
    whyItMatters: 'Shows deep understanding of dense vector embeddings, reciprocal rank fusion (RRF) hybrid retrieval, chunking strategies, and ground-truth evaluation.',
    techStack: ['Python / TypeScript', 'FastAPI / Express', 'ChromaDB or pgvector', 'Gemini API', 'Docker'],
    milestones: [
      { title: 'Document Parsing & Chunking', target: 'Build markdown and code chunker with sliding character overlaps and metadata extraction', hours: 5 },
      { title: 'Hybrid Retrieval Pipeline', target: 'Implement BM25 lexical search + dense embedding similarity blended with Reciprocal Rank Fusion', hours: 7 },
      { title: 'Grounded Answer Generation', target: 'Inject citations and confidence scoring into LLM synthesized answers', hours: 5 },
      { title: 'Evaluation Benchmark Suite', target: 'Evaluate precision@k and recall@k against 50 canonical engineering questions', hours: 6 }
    ],
    testingRequirements: 'Unit tests for chunk boundary preservation; automated benchmark script measuring Mean Reciprocal Rank (MRR).',
    deliverables: [
      'Search engine API with interactive query playground',
      'pgvector or ChromaDB migration scripts',
      'Evaluation report comparing pure vector vs hybrid retrieval results'
    ],
    developedSkills: ['vector-search-rag', 'ml-fundamentals', 'rest-api-design', 'testing-fundamentals'],
    status: 'saved'
  },
  {
    id: 'zero-trust-auth-gateway',
    title: 'Zero-Trust OAuth 2.0 PKCE & RBAC Microservice Gateway',
    careerTrackId: 'backend-dev',
    difficulty: 'Advanced',
    category: 'Security & Microservices',
    problemStatement: 'Modern microservices require stateless authentication, short-lived tokens, and fast role-based authorization without central database bottlenecks.',
    whyItMatters: 'Hiring managers prioritize candidates who understand cryptographic verification (RS256), cryptographic salt/hash, token rotation, and defense in depth.',
    techStack: ['TypeScript / Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    milestones: [
      { title: 'Key Pair Generation & JWKS Endpoint', target: 'Serve public JSON Web Key Sets (JWKS) with RS256 asynchronous signing', hours: 5 },
      { title: 'Refresh Token Family Rotation', target: 'Implement automatic breach revocation when a stale refresh token is reused', hours: 6 },
      { title: 'RBAC Policy Engine', target: 'Enforce granular permissions with hierarchical roles (Admin, Editor, Viewer)', hours: 4 },
      { title: 'End-to-End Auth Test Suite', target: 'Verify brute-force rate limiting and CSRF protection under malicious payloads', hours: 5 }
    ],
    testingRequirements: 'Automated test suite simulating replay attacks, expired signatures, and token rotation security checks.',
    deliverables: [
      'Production-grade gateway middleware module',
      'Security architecture threat model document',
      'Integration test suite with 100% auth branch coverage'
    ],
    developedSkills: ['auth-security', 'rest-api-design', 'sql-relational-db', 'testing-fundamentals'],
    status: 'saved'
  },
  {
    id: 'fullstack-saas-platform',
    title: 'Full-Stack Developer Analytics Platform with Realtime Webhooks',
    careerTrackId: 'fullstack-dev',
    difficulty: 'Advanced',
    category: 'Full-Stack Product Engineering',
    problemStatement: 'Developers need unified visibility into their CI run times, deployment failures, and PR velocity across repositories.',
    whyItMatters: 'Demonstrates end-to-end fullstack craftsmanship: secure webhook ingestion, background queuing, transactional DB writes, and reactive dashboard graphs.',
    techStack: ['React 19 / Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    milestones: [
      { title: 'Webhook Ingestion Endpoint', target: 'Verify HMAC SHA-256 signatures and queue events idempotently', hours: 5 },
      { title: 'Analytical Database Schema', target: 'Design PostgreSQL schema for event rollups and pipeline duration percentiles', hours: 6 },
      { title: 'Interactive Developer Dashboard', target: 'Build responsive charts showing deploy frequency and lead time with zero page reload', hours: 7 },
      { title: 'Team Access Control & Settings', target: 'Implement workspace organization switching and webhook secret regeneration', hours: 5 }
    ],
    testingRequirements: 'Unit tests for webhook signature validation; E2E tests for dashboard filtering and date range drill-downs.',
    deliverables: [
      'Full-stack repository with complete migrations',
      'Seed script generating 1,000 synthetic developer events',
      'Docker Compose setup for one-command local startup'
    ],
    developedSkills: ['typescript-foundations', 'react-architecture', 'rest-api-design', 'sql-relational-db', 'docker-containers'],
    status: 'saved'
  }
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'sql-b-tree-query-planner',
    category: 'Databases & SQL',
    difficulty: 'Intermediate',
    title: 'B-Tree Indexing Mechanics and Query Planner Costing',
    question: 'Explain how a B-Tree index accelerates SELECT queries in PostgreSQL. Under what conditions will the PostgreSQL query planner deliberately ignore an existing index on a filtered column and perform a Sequential Scan instead?',
    keyConcepts: [
      'Logarithmic search time O(log N) through ordered tree traversal',
      'Minimization of random disk I/O pages compared to full table scans',
      'Low selectivity where planner estimates scanning a large fraction of the table sequentially is cheaper than random index page lookups',
      'Functions or expressions wrapping the indexed column (e.g. WHERE LOWER(email) = ...) without an expression index',
      'Stale table statistics requiring ANALYZE'
    ],
    sampleModelAnswer: 'A B-Tree index maintains a balanced multi-way search tree of sorted key-pointer pairs. For queries with equality or range filters, PostgreSQL traverses from the root to the leaf nodes in O(log N) time, reading only a handful of disk pages instead of scanning the entire heap. The query planner evaluates estimated cost using table statistics (pg_statistic). It ignores an index and falls back to a Sequential Scan when: (1) Low selectivity: if the filter matches a high percentage (typically 10-20%+) of total rows, sequential disk reads with read-ahead caching are significantly faster than random single-page I/O lookups from index to table heap; (2) The indexed column is wrapped in an untyped function or operation (e.g. WHERE DATE(created_at) = ...), which invalidates standard column indexing unless a corresponding functional index is defined; (3) Table statistics are severely outdated, leading the planner to misestimate row counts.',
    relatedSkillId: 'advanced-sql-window'
  },
  {
    id: 'event-loop-microtasks',
    category: 'JavaScript & Node.js',
    difficulty: 'Intermediate',
    title: 'Node.js / Browser Event Loop: Microtasks vs Macrotasks',
    question: 'Walk through how the JavaScript event loop executes Promise.then(), setTimeout(), queueMicrotask(), and standard synchronous code. What is the exact execution order and why does a runaway microtask queue cause UI freezing or process starvation?',
    keyConcepts: [
      'Call stack execution of synchronous frames first',
      'Microtask queue (Promises, queueMicrotask, process.nextTick) has strict priority over the Macrotask queue (setTimeout, setInterval, I/O)',
      'The microtask queue must be completely drained before the next macrotask or render phase can begin',
      'A recursive or runaway microtask loop continually feeds the microtask queue, indefinitely postponing rendering, layout, and macrotasks'
    ],
    sampleModelAnswer: 'When the JavaScript runtime executes a script, synchronous execution frames are pushed onto the Call Stack. When asynchronous primitives are encountered: (1) Synchronous code runs to completion; (2) Microtasks (Promise callbacks, queueMicrotask) are queued in the microtask FIFO queue; (3) Macrotasks (setTimeout, setInterval, I/O callbacks) are queued in the task queue. Upon the call stack becoming empty, the event loop ALWAYS drains the microtask queue entirely until it is empty before advancing to the rendering steps or the next macrotask. If a microtask continually enqueues another microtask, the call stack never yields to the browser render tree (causing UI freezing) or to macrotasks (causing I/O starvation in Node.js).',
    relatedSkillId: 'typescript-foundations'
  },
  {
    id: 'rest-idempotency-concurrency',
    category: 'Backend Architecture',
    difficulty: 'Advanced',
    title: 'REST Idempotency and Race Condition Prevention',
    question: 'How do you guarantee that a financial payment or checkout POST request is strictly idempotent across network retries, and how do you protect against double-spend race conditions at the database layer?',
    keyConcepts: [
      'Client-generated unique Idempotency-Key header (UUIDv4)',
      'Distributed lock (Redis) or atomic database reservation on the idempotency key',
      'Database unique constraints on (user_id, transaction_reference)',
      'ACID transactional isolation levels (SELECT FOR UPDATE pessimistic locking or optimistic concurrency versioning)',
      'Caching the definitive HTTP response payload for repeat requests with identical keys'
    ],
    sampleModelAnswer: 'To achieve strict idempotency: (1) The client sends an Idempotency-Key header containing a cryptographically unique UUID for the payment attempt; (2) Upon arrival at the API gateway or service layer, an atomic database transaction or Redis SETNX lock is acquired on the key. If the key already exists with status "COMPLETED", the server immediately returns the cached original HTTP response without re-executing business logic; (3) If the key is currently "PROCESSING", concurrent requests receive HTTP 409 Conflict or wait on the lock; (4) At the database layer, double-spend race conditions are prevented using SELECT FOR UPDATE on the user account row within a SERIALIZABLE or REPEATABLE READ transaction, or using a UNIQUE constraint on the idempotent reference column. This guarantees that even if two concurrent threads pass the application check, one will encounter a unique constraint violation and rollback gracefully.',
    relatedSkillId: 'rest-api-design'
  },
  {
    id: 'react-reconciliation-memo',
    category: 'Frontend Architecture',
    difficulty: 'Intermediate',
    title: 'React Fiber Reconciliation and Re-render Optimization',
    question: 'Explain how React Fiber reconciliation decides whether to re-render a component and update the DOM. What is the fundamental difference between useMemo, useCallback, and React.memo, and when does premature optimization harm performance?',
    keyConcepts: [
      'Fiber tree diffing with keys and reference equality checks on props and state',
      'React.memo wraps a component to skip re-renders if shallow props comparison is unchanged',
      'useCallback memoizes function references between renders',
      'useMemo memoizes computed values between renders',
      'Overhead of memory allocation, dependency array comparison, and closure retention makes premature memoization on trivial computations wasteful'
    ],
    sampleModelAnswer: 'React Fiber reconciliation manages two trees: the current fiber tree and the work-in-progress tree. When state changes, React marks the fiber as dirty and schedules a render pass. By default, whenever a parent component re-renders, all child components re-render recursively regardless of whether their own props changed. React.memo is a higher-order component that performs a shallow equality check (Object.is) on incoming props; if props have not changed by reference, React skips rendering that child subtree. useCallback caches a function instance so its reference remains stable across renders (preventing React.memo children from re-rendering due to new function references). useMemo caches the result of an expensive calculation. Premature memoization adds memory overhead (allocating dependency arrays and cache closures) and runtime CPU cost (iterating and comparing dependencies on every single render). It should be reserved for genuinely expensive calculations or when passing callbacks to memoized children.',
    relatedSkillId: 'react-architecture'
  },
  {
    id: 'cap-theorem-distributed',
    category: 'System Design',
    difficulty: 'Advanced',
    title: 'The CAP Theorem and Eventual Consistency in Practice',
    question: 'State the CAP theorem. When a network partition occurs in a distributed datastore, what tradeoff must be made between Consistency and Availability? Give concrete examples of CP and AP databases and explain what "eventual consistency" actually means.',
    keyConcepts: [
      'Consistency (every read receives the most recent write or an error)',
      'Availability (every non-failing node returns a non-error response, without guarantee of recent write)',
      'Partition tolerance (system continues to operate despite arbitrary message loss or delay)',
      'During a network partition (P), you must choose between rejecting requests to ensure consistency (CP) or accepting writes that temporarily diverge across partitions (AP)',
      'Examples: PostgreSQL with synchronous replication or ZooKeeper/Raft (CP) vs DynamoDB or Cassandra with tunable quorum (AP)',
      'Eventual consistency: In the absence of new write updates, all replicas will eventually converge to identical state'
    ],
    sampleModelAnswer: 'The CAP theorem states that a distributed datastore cannot simultaneously guarantee Consistency, Availability, and Partition Tolerance. Because network partitions (network cables cut, router failures, packet drops) are unavoidable in distributed systems, Partition Tolerance (P) is non-negotiable; therefore, the system must choose between Consistency (C) and Availability (A) during a partition. A CP system (e.g., ZooKeeper, Google Spanner, or PostgreSQL with synchronous standby) prioritizes strict consistency: if a node cannot reach the quorum leader to verify the latest commit, it rejects the read or write with an error or timeout, sacrificing availability. An AP system (e.g., Apache Cassandra, Couchbase, or DynamoDB with relaxed read consistency) prioritizes availability: all nodes continue accepting writes and serving reads, even if they are isolated from other partitions. This leads to eventual consistency: replicas temporarily hold divergent state, but once network connectivity is restored and anti-entropy gossip/read-repair processes complete, all nodes converge to identical data.',
    relatedSkillId: 'system-design-basics'
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_student_alpha',
  fullName: 'Alex Chen',
  email: 'alex.chen@university.edu',
  educationLevel: 'Undergraduate Senior',
  degreeMajor: 'Computer Science & Software Engineering',
  careerTrackId: 'backend-dev',
  targetRole: 'Junior Backend Systems Engineer',
  weeklyHoursBudget: 12,
  preparationTimelineWeeks: 14,
  learningStyle: 'hands-on-projects',
  skills: {
    'prog-foundations': {
      skillId: 'prog-foundations',
      selfReportedLevel: 4,
      verifiedLevel: 4,
      evidenceType: 'project_repo',
      notes: 'Completed algorithms coursework and built command-line utilities in TypeScript and Python.',
      updatedAt: '2026-10-15T09:00:00Z'
    },
    'git-version-control': {
      skillId: 'git-version-control',
      selfReportedLevel: 4,
      verifiedLevel: 3,
      evidenceType: 'project_repo',
      notes: 'Comfortable with branch workflows and PRs; practicing clean rebasing.',
      updatedAt: '2026-10-15T09:00:00Z'
    },
    'data-structures': {
      skillId: 'data-structures',
      selfReportedLevel: 3,
      verifiedLevel: 3,
      evidenceType: 'interview_quiz',
      notes: 'Strong in arrays, maps, and recursion; continuing practice with trees and graphs.',
      updatedAt: '2026-10-18T10:00:00Z'
    },
    'sql-relational-db': {
      skillId: 'sql-relational-db',
      selfReportedLevel: 3,
      verifiedLevel: 2,
      evidenceType: 'resume_scan',
      notes: 'Familiar with basic queries, foreign keys, and joins in PostgreSQL.',
      updatedAt: '2026-10-20T11:00:00Z'
    },
    'rest-api-design': {
      skillId: 'rest-api-design',
      selfReportedLevel: 3,
      verifiedLevel: 2,
      evidenceType: 'project_repo',
      notes: 'Built basic CRUD endpoints in Express; need deeper work on idempotency and rate limiting.',
      updatedAt: '2026-10-22T14:00:00Z'
    },
    'docker-containers': {
      skillId: 'docker-containers',
      selfReportedLevel: 2,
      verifiedLevel: 1,
      evidenceType: 'none',
      notes: 'Know basic docker run commands; practicing multi-stage Dockerfiles.',
      updatedAt: '2026-10-25T16:00:00Z'
    },
    'testing-fundamentals': {
      skillId: 'testing-fundamentals',
      selfReportedLevel: 2,
      verifiedLevel: 1,
      evidenceType: 'none',
      notes: 'Have written basic assert tests; want to adopt test-driven habits and mock suites.',
      updatedAt: '2026-10-26T17:00:00Z'
    }
  },
  createdAt: '2026-10-15T09:00:00Z',
  updatedAt: '2026-10-26T17:00:00Z'
};
