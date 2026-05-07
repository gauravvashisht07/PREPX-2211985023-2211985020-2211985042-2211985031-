export const roadmaps = [
  {
    id: 'dsa', title: 'DSA & CP Roadmap', icon: '🌳', color: '#8b5cf6',
    steps: [
      { title: 'Programming Fundamentals', desc: 'Choose a language (C++/Java/Python). Master arrays, strings, basic I/O, time/space complexity.', resources: ['GeeksforGeeks', 'CS50', 'CLRS Book'], weeks: '1-2' },
      { title: 'Arrays & Strings', desc: 'Two pointers, sliding window, prefix sums, sorting. Solve 50+ problems.', resources: ['LeetCode Arrays', 'Striver Array Sheet'], weeks: '2-3' },
      { title: 'Linked Lists, Stacks, Queues', desc: 'Singly, doubly, circular lists. Stack/queue implementations and applications.', resources: ['LeetCode LinkedList', 'NeetCode'], weeks: '3-4' },
      { title: 'Trees & Heaps', desc: 'Binary trees, BST, AVL basics. Heaps, priority queues, heap sort. Tree traversals.', resources: ['LeetCode Trees', 'Striver Tree Sheet'], weeks: '4-6' },
      { title: 'Graphs', desc: 'BFS, DFS, topological sort, shortest paths (Dijkstra, Bellman-Ford), MST (Kruskal, Prim), SCCs.', resources: ['CP-algorithms.com', 'LeetCode Graphs'], weeks: '6-8' },
      { title: 'Dynamic Programming', desc: 'Memoization, tabulation. Classic problems: LCS, LIS, Knapsack, Matrix Chain, Edit Distance.', resources: ['DP Patterns by Aditya Verma', 'LeetCode DP'], weeks: '8-11' },
      { title: 'Advanced Topics', desc: 'Tries, Segment Trees, BIT, Disjoint Set Union, String algorithms (KMP, Z-function).', resources: ['CP-algorithms.com', 'Codeforces EDU'], weeks: '11-14' },
      { title: 'Mock Contests & Practice', desc: 'Participate in Codeforces, LeetCode contests. Target Div2 A+B+C consistent. Solve company problems on LeetCode.', resources: ['Codeforces', 'LeetCode Contest', 'InterviewBit'], weeks: '14+' },
    ]
  },
  {
    id: 'webdev', title: 'Full Stack Web Dev', icon: '🌐', color: '#06b6d4',
    steps: [
      { title: 'HTML & CSS Basics', desc: 'Semantic HTML5, CSS box model, flexbox, grid, responsive design, media queries.', resources: ['MDN Web Docs', 'freeCodeCamp'], weeks: '1-2' },
      { title: 'JavaScript Fundamentals', desc: 'ES6+, closures, promises, async/await, DOM manipulation, event loop.', resources: ['javascript.info', 'Eloquent JavaScript'], weeks: '2-4' },
      { title: 'React & State Management', desc: 'Components, hooks (useState, useEffect, useContext), React Router, Redux/Zustand.', resources: ['React Official Docs', 'Scrimba React'], weeks: '4-6' },
      { title: 'Node.js & Express', desc: 'REST API design, middleware, routing, error handling, environment variables.', resources: ['Node.js docs', 'The Odin Project'], weeks: '6-8' },
      { title: 'Databases', desc: 'SQL (PostgreSQL/MySQL) basics, MongoDB, Mongoose ODM, database design, indexing.', resources: ['Prisma Docs', 'MongoDB University'], weeks: '8-10' },
      { title: 'Authentication & Security', desc: 'JWT, OAuth 2.0, bcrypt, HTTPS, CORS, input validation, environment secrets.', resources: ['OWASP Top 10', 'Auth0 Docs'], weeks: '10-11' },
      { title: 'Deployment & DevOps', desc: 'Docker basics, CI/CD, deploy to AWS/Vercel/Railway, domain setup, monitoring.', resources: ['Docker docs', 'Vercel', 'AWS Free Tier'], weeks: '11-13' },
      { title: 'Build Portfolio Projects', desc: 'Build 3-4 full-stack projects: e-commerce, social app, SaaS tool. Write case studies on GitHub.', resources: ['GitHub', 'Dev.to', 'Hashnode'], weeks: '13+' },
    ]
  },
  {
    id: 'systemdesign', title: 'System Design', icon: '🏗️', color: '#f59e0b',
    steps: [
      { title: 'Foundations', desc: 'CAP theorem, consistency models, scalability basics: vertical vs horizontal scaling, caching, CDN.', resources: ['ByteByteGo', 'Gaurav Sen YouTube'], weeks: '1-2' },
      { title: 'Databases at Scale', desc: 'SQL vs NoSQL trade-offs, sharding, replication, partitioning, read replicas, DB indexing at scale.', resources: ['Designing Data-Intensive Applications', 'CMU 15-445'], weeks: '2-4' },
      { title: 'Caching', desc: 'Redis, Memcached, cache-aside, write-through, write-back. Cache eviction policies (LRU, LFU).', resources: ['Redis docs', 'ByteByteGo blog'], weeks: '4-5' },
      { title: 'Message Queues', desc: 'Kafka, RabbitMQ. Producer-consumer pattern, pub-sub, event sourcing, exactly-once delivery.', resources: ['Confluent Kafka docs', 'RabbitMQ tutorials'], weeks: '5-6' },
      { title: 'Load Balancing & Microservices', desc: 'Load balancer algorithms, API gateway, service mesh, circuit breaker, service discovery.', resources: ['NGINX docs', 'Martin Fowler Microservices'], weeks: '6-8' },
      { title: 'Design Case Studies', desc: 'Practice designing: URL shortener, Twitter, WhatsApp, Netflix, Uber. Follow structured approach (requirements → estimations → design → deep dive).', resources: ['System Design Primer GitHub', 'Exponent YouTube'], weeks: '8-12' },
    ]
  },
  {
    id: 'corecs', title: 'Core CS for Interviews', icon: '🖥️', color: '#10b981',
    steps: [
      { title: 'Operating Systems', desc: 'Processes, threads, scheduling algorithms, memory management, paging, synchronization, deadlocks.', resources: ['OSTEP Book (free online)', 'GFG OS'], weeks: '1-3' },
      { title: 'DBMS', desc: 'Relational model, SQL mastery, normalization, transactions (ACID), indexing, concurrency control.', resources: ['CMU 15-445 videos', 'Korth DBMS Book'], weeks: '3-5' },
      { title: 'Computer Networks', desc: 'OSI/TCP-IP, protocols (DNS, HTTP, TCP, UDP), socket programming basics, security concepts.', resources: ['Tanenbaum Networks Book', 'JavaTPoint CN'], weeks: '5-7' },
      { title: 'Object-Oriented Design', desc: 'SOLID principles, design patterns (GoF 23 patterns), UML basics, low-level design practice.', resources: ['Refactoring.guru', 'Head First Design Patterns'], weeks: '7-9' },
      { title: 'Mock Technical Interviews', desc: 'Do 20+ mock interviews on Pramp/Interviewing.io. Record yourself. Practice thinking aloud. Time your solutions.', resources: ['Pramp.com', 'Interviewing.io', 'LeetCode Contest'], weeks: '9+' },
    ]
  },
];
