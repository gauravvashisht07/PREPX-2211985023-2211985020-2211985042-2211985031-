export const mcqQuestions = [
  // DSA MCQs
 {
  id: 1,
  topic: 'DSA',
  subtopic: 'Arrays',
  difficulty: 'Easy',
  question: 'What is the time complexity of accessing an element in an array by index?',
  options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'],
  correctAnswer: 2,
  explanation: 'Array elements are stored in contiguous memory, so accessing any element by index takes constant time O(1).'
},
{
  id: 2,
  topic: 'DSA',
  subtopic: 'Arrays',
  difficulty: 'Medium',
  question: 'What is the time complexity of binary search?',
  options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
  correctAnswer: 1,
  explanation: 'Binary search halves the search space each time → O(log n).'
},
{
  id: 3,
  topic: 'DSA',
  subtopic: 'Arrays',
  difficulty: 'Easy',
  question: 'What is the time complexity of searching in an unsorted array?',
  options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'],
  correctAnswer: 1,
  explanation: 'In worst case, all elements are checked → O(n).'
},
{
  id: 4,
  topic: 'DSA',
  subtopic: 'Sorting',
  difficulty: 'Easy',
  question: 'Which sorting algorithm is stable?',
  options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'],
  correctAnswer: 1,
  explanation: 'Merge Sort maintains relative order of equal elements.'
},
{
  id: 5,
  topic: 'DSA',
  subtopic: 'Sorting',
  difficulty: 'Medium',
  question: 'Worst-case time complexity of Quick Sort?',
  options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
  correctAnswer: 1,
  explanation: 'Worst case occurs when pivot is smallest/largest.'
},
{
  id: 6,
  topic: 'DSA',
  subtopic: 'Stack',
  difficulty: 'Easy',
  question: 'Which principle does stack follow?',
  options: ['FIFO', 'LIFO', 'Priority', 'Random'],
  correctAnswer: 1,
  explanation: 'Stack follows Last In First Out.'
},
{
  id: 7,
  topic: 'DSA',
  subtopic: 'Queue',
  difficulty: 'Easy',
  question: 'Which principle does queue follow?',
  options: ['FIFO', 'LIFO', 'Priority', 'Random'],
  correctAnswer: 0,
  explanation: 'Queue follows First In First Out.'
},
{
  id: 8,
  topic: 'DSA',
  subtopic: 'Linked List',
  difficulty: 'Medium',
  question: 'Time complexity to insert at head in linked list?',
  options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
  correctAnswer: 0,
  explanation: 'Insertion at head does not require traversal.'
},
{
  id: 9,
  topic: 'DSA',
  subtopic: 'Linked List',
  difficulty: 'Medium',
  question: 'Deleting last node in singly linked list takes?',
  options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
  correctAnswer: 1,
  explanation: 'Traversal is required → O(n).'
},
{
  id: 10,
  topic: 'DSA',
  subtopic: 'Trees',
  difficulty: 'Easy',
  question: 'Maximum number of nodes at level k in a binary tree?',
  options: ['2^k', 'k^2', 'k', '2k'],
  correctAnswer: 0,
  explanation: 'Each level doubles nodes → 2^k.'
},
{
  id: 11,
  topic: 'DSA',
  subtopic: 'Trees',
  difficulty: 'Medium',
  question: 'Height of a balanced BST?',
  options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
  correctAnswer: 1,
  explanation: 'Balanced BST maintains logarithmic height.'
},
{
  id: 12,
  topic: 'DSA',
  subtopic: 'Trees',
  difficulty: 'Medium',
  question: 'Inorder traversal of BST gives?',
  options: ['Sorted order', 'Reverse order', 'Random', 'Level order'],
  correctAnswer: 0,
  explanation: 'Inorder traversal gives sorted sequence.'
},
{
  id: 13,
  topic: 'DSA',
  subtopic: 'Graphs',
  difficulty: 'Medium',
  question: 'Time complexity of BFS?',
  options: ['O(V+E)', 'O(V²)', 'O(E log V)', 'O(V)'],
  correctAnswer: 0,
  explanation: 'Each vertex and edge is visited once.'
},
{
  id: 14,
  topic: 'DSA',
  subtopic: 'Graphs',
  difficulty: 'Easy',
  question: 'Which data structure is used in BFS?',
  options: ['Stack', 'Queue', 'Heap', 'Tree'],
  correctAnswer: 1,
  explanation: 'Queue ensures level order traversal.'
},
{
  id: 15,
  topic: 'DSA',
  subtopic: 'Graphs',
  difficulty: 'Medium',
  question: 'DFS uses which structure?',
  options: ['Queue', 'Stack', 'Heap', 'Array'],
  correctAnswer: 1,
  explanation: 'DFS uses recursion or stack.'
},
{
  id: 16,
  topic: 'DSA',
  subtopic: 'Dynamic Programming',
  difficulty: 'Medium',
  question: 'DP is based on?',
  options: ['Greedy choice', 'Optimal substructure', 'Sorting', 'Hashing'],
  correctAnswer: 1,
  explanation: 'DP solves subproblems optimally.'
},
{
  id: 17,
  topic: 'DSA',
  subtopic: 'Dynamic Programming',
  difficulty: 'Medium',
  question: 'Memoization is?',
  options: ['Bottom-up', 'Top-down', 'Sorting', 'Searching'],
  correctAnswer: 1,
  explanation: 'Memoization is top-down DP.'
},
{
  id: 18,
  topic: 'DSA',
  subtopic: 'Greedy',
  difficulty: 'Medium',
  question: 'Greedy algorithms follow?',
  options: ['Global optimal', 'Local optimal', 'Random', 'Backtracking'],
  correctAnswer: 1,
  explanation: 'Greedy chooses local optimum.'
},
{
  id: 19,
  topic: 'DSA',
  subtopic: 'Hashing',
  difficulty: 'Easy',
  question: 'Average search time in HashMap?',
  options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
  correctAnswer: 2,
  explanation: 'Hashing gives constant time average.'
},
{
  id: 20,
  topic: 'DSA',
  subtopic: 'Hashing',
  difficulty: 'Medium',
  question: 'Collision resolution technique in Java?',
  options: ['Chaining', 'Probing', 'Hashing', 'Sorting'],
  correctAnswer: 0,
  explanation: 'Java uses chaining.'
},
{
  id: 21,
  topic: 'DSA',
  subtopic: 'Heap',
  difficulty: 'Medium',
  question: 'Heap is implemented using?',
  options: ['Array', 'Linked List', 'Stack', 'Queue'],
  correctAnswer: 0,
  explanation: 'Heap uses array representation.'
},
{
  id: 22,
  topic: 'DSA',
  subtopic: 'Heap',
  difficulty: 'Medium',
  question: 'Insert in heap takes?',
  options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
  correctAnswer: 1,
  explanation: 'Heapify operation → O(log n).'
},
{
  id: 23,
  topic: 'DSA',
  subtopic: 'Trie',
  difficulty: 'Medium',
  question: 'Trie is used for?',
  options: ['Sorting', 'Prefix search', 'Graphs', 'DP'],
  correctAnswer: 1,
  explanation: 'Trie supports efficient prefix matching.'
},
{
  id: 24,
  topic: 'DSA',
  subtopic: 'Recursion',
  difficulty: 'Easy',
  question: 'Recursion uses which structure?',
  options: ['Queue', 'Stack', 'Heap', 'Array'],
  correctAnswer: 1,
  explanation: 'Function calls go to call stack.'
},
{
  id: 25,
  topic: 'DSA',
  subtopic: 'Backtracking',
  difficulty: 'Medium',
  question: 'Backtracking is?',
  options: ['Greedy', 'Recursive search', 'Sorting', 'Hashing'],
  correctAnswer: 1,
  explanation: 'Backtracking explores all possibilities.'
},
{
  id: 26,
  topic: 'DSA',
  subtopic: 'Searching',
  difficulty: 'Easy',
  question: 'Linear search complexity?',
  options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
  correctAnswer: 1,
  explanation: 'Checks each element.'
},
{
  id: 27,
  topic: 'DSA',
  subtopic: 'Sorting',
  difficulty: 'Medium',
  question: 'Merge sort complexity?',
  options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
  correctAnswer: 0,
  explanation: 'Divide and conquer → O(n log n).'
},
{
  id: 28,
  topic: 'DSA',
  subtopic: 'Graphs',
  difficulty: 'Medium',
  question: 'Dijkstra works for?',
  options: ['Negative weights', 'Non-negative weights', 'Unweighted only', 'Trees'],
  correctAnswer: 1,
  explanation: 'Requires non-negative weights.'
},
{
  id: 29,
  topic: 'DSA',
  subtopic: 'Trees',
  difficulty: 'Medium',
  question: 'AVL tree is?',
  options: ['Unbalanced', 'Self-balancing BST', 'Heap', 'Graph'],
  correctAnswer: 1,
  explanation: 'AVL maintains balance.'
},
{
  id: 30,
  topic: 'DSA',
  subtopic: 'Bit Manipulation',
  difficulty: 'Medium',
  question: 'x & (x-1) is used to?',
  options: ['Add bit', 'Remove lowest set bit', 'Multiply', 'Divide'],
  correctAnswer: 1,
  explanation: 'Removes lowest set bit.'
},

  // OS MCQs
  {
    id: 10,
    topic: 'OS',
    subtopic: 'Processes',
    difficulty: 'Easy',
    question: 'What is the main difference between a process and a thread?',
    options: ['Processes are faster', 'Threads share memory within a process; Processes have independent memory', 'Threads can only execute one task', 'There is no difference'],
    correctAnswer: 1,
    explanation: 'A process has its own memory space and resources. Threads are lightweight units within a process that share memory with sibling threads.'
  },
  {
    id: 11,
    topic: 'OS',
    subtopic: 'Scheduling',
    difficulty: 'Medium',
    question: 'In Round Robin scheduling, what happens after a process uses its time quantum?',
    options: ['It terminates', 'It\'s moved to the end of the ready queue', 'It\'s blocked permanently', 'It gets priority'],
    correctAnswer: 1,
    explanation: 'After using the time quantum, the process is preempted and moved to the end of the ready queue to ensure fairness.'
  },
  {
    id: 12,
    topic: 'OS',
    subtopic: 'Memory',
    difficulty: 'Medium',
    question: 'What is virtual memory?',
    options: ['Memory that is faster than RAM', 'Memory in the CPU cache', 'Extension of RAM using disk storage', 'A type of RAM'],
    correctAnswer: 2,
    explanation: 'Virtual memory allows processes to use more memory than physically available RAM by using disk storage as an extension.'
  },
  {
    id: 13,
    topic: 'OS',
    subtopic: 'Synchronization',
    difficulty: 'Hard',
    question: 'State the four Coffman conditions necessary for a deadlock to occur:',
    options: ['Any two of them', 'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait', 'Only Mutual Exclusion is needed', 'These only apply to threads'],
    correctAnswer: 1,
    explanation: 'All four conditions must be present for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Eliminating any one prevents deadlock.'
  },
  {
    id: 14,
    topic: 'OS',
    subtopic: 'Synchronization',
    difficulty: 'Medium',
    question: 'What is a binary semaphore used for?',
    options: ['Controlling multiple resources', 'Mutual exclusion (mutex)', 'Process scheduling', 'Memory allocation'],
    correctAnswer: 1,
    explanation: 'A binary semaphore can be 0 or 1 and is primarily used for mutual exclusion, similar to a mutex.'
  },
  {
    id: 15,
    topic: 'OS',
    subtopic: 'Processes',
    difficulty: 'Easy',
    question: 'What are the typical process states?',
    options: ['Ready, Running, Waiting', 'New, Ready, Running, Waiting, Terminated', 'Only Running', 'Active, Inactive'],
    correctAnswer: 1,
    explanation: 'Process states: New (created) → Ready (waiting for CPU) → Running (executing) → Waiting (I/O) → Terminated.'
  },
  {
    id: 16,
    topic: 'OS',
    subtopic: 'Memory',
    difficulty: 'Medium',
    question: 'What is thrashing in virtual memory?',
    options: ['Fast memory access', 'System spending more time paging than executing', 'RAM being full', 'Process termination'],
    correctAnswer: 1,
    explanation: 'Thrashing occurs when the system spends excessive time paging between RAM and disk, reducing actual computation time. Caused by insufficient RAM.'
  },

  // DBMS MCQs
  {
    id: 17,
    topic: 'DBMS',
    subtopic: 'Fundamentals',
    difficulty: 'Easy',
    question: 'DDL (Data Definition Language) includes:',
    options: ['SELECT, INSERT, UPDATE', 'CREATE, ALTER, DROP', 'GRANT, REVOKE', 'COMMIT, ROLLBACK'],
    correctAnswer: 1,
    explanation: 'DDL statements define and modify database schema: CREATE (create), ALTER (modify), DROP (delete).'
  },
  {
    id: 18,
    topic: 'DBMS',
    subtopic: 'Transactions',
    difficulty: 'Medium',
    question: 'What does the "C" in ACID stand for?',
    options: ['Concurrency', 'Consistency', 'Commitment', 'Completion'],
    correctAnswer: 1,
    explanation: 'ACID: Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent transactions appear sequential), Durability (persistent).'
  },
  {
    id: 19,
    topic: 'DBMS',
    subtopic: 'Normalization',
    difficulty: 'Medium',
    question: 'What does 3NF ensure?',
    options: ['No partial dependencies', 'No transitive dependencies', 'Atomic values only', 'Only one primary key'],
    correctAnswer: 1,
    explanation: '3NF (Third Normal Form) ensures: must be in 2NF AND have no transitive dependencies (non-key attributes don\'t depend on other non-key attributes).'
  },
  {
    id: 20,
    topic: 'DBMS',
    subtopic: 'SQL',
    difficulty: 'Easy',
    question: 'Which JOIN returns only matching rows from both tables?',
    options: ['LEFT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN'],
    correctAnswer: 1,
    explanation: 'INNER JOIN returns only rows where there is a match in both tables. LEFT/RIGHT/FULL return unmatched rows with NULLs.'
  },
  {
    id: 21,
    topic: 'DBMS',
    subtopic: 'Indexing',
    difficulty: 'Hard',
    question: 'Why is B+ Tree preferred for database indexing?',
    options: ['It uses less memory', 'Data only in leaf nodes, shorter tree height, efficient range queries', 'It\'s faster to write', 'It doesn\'t allow duplicates'],
    correctAnswer: 1,
    explanation: 'B+ Tree stores data only in leaf nodes with doubly-linked list, resulting in fewer disk reads due to shorter tree height and efficient range queries.'
  },
  {
    id: 22,
    topic: 'DBMS',
    subtopic: 'SQL',
    difficulty: 'Medium',
    question: 'What is the difference between WHERE and HAVING?',
    options: ['They are the same', 'WHERE filters rows before GROUP BY; HAVING filters groups after GROUP BY', 'HAVING is always slower', 'WHERE uses aggregate functions'],
    correctAnswer: 1,
    explanation: 'WHERE: filters rows before GROUP BY (no aggregate functions). HAVING: filters groups after GROUP BY (can use aggregate functions).'
  },

  // CN MCQs
  {
    id: 23,
    topic: 'CN',
    subtopic: 'Basics',
    difficulty: 'Easy',
    question: 'How many layers are in the OSI model?',
    options: ['5', '7', '6', '4'],
    correctAnswer: 1,
    explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.'
  },
  {
    id: 24,
    topic: 'CN',
    subtopic: 'TCP/IP',
    difficulty: 'Medium',
    question: 'What are the first step in TCP 3-way handshake called?',
    options: ['FIN', 'SYN', 'ACK', 'RST'],
    correctAnswer: 1,
    explanation: 'TCP 3-way handshake: (1) SYN from client, (2) SYN-ACK from server, (3) ACK from client. Connection is then established.'
  },
  {
    id: 25,
    topic: 'CN',
    subtopic: 'HTTP',
    difficulty: 'Medium',
    question: 'Which is an advantage of HTTP/2 over HTTP/1.1?',
    options: ['Text-based protocol', 'One request per connection', 'Multiplexing & header compression', 'Slower'],
    correctAnswer: 2,
    explanation: 'HTTP/2 features: binary protocol, multiplexing (multiple requests per connection), header compression, server push, better performance.'
  },
  {
    id: 26,
    topic: 'CN',
    subtopic: 'DNS',
    difficulty: 'Easy',
    question: 'Which port does DNS use?',
    options: ['80', '443', '53', '25'],
    correctAnswer: 2,
    explanation: 'DNS uses UDP port 53 for queries and TCP port 53 for zone transfers. It resolves domain names to IP addresses.'
  },
  {
    id: 27,
    topic: 'CN',
    subtopic: 'Security',
    difficulty: 'Hard',
    question: 'What provides forward secrecy in TLS?',
    options: ['RSA encryption', 'ECDHE (Elliptic Curve Diffie-Hellman Ephemeral)', 'Digital certificates', 'Symmetric keys'],
    correctAnswer: 1,
    explanation: 'ECDHE ensures forward secrecy: even if the private key is compromised, past traffic remains secure because session keys aren\'t derived from the long-term key.'
  },
  {
    id: 28,
    topic: 'CN',
    subtopic: 'TCP/IP',
    difficulty: 'Easy',
    question: 'When should you use UDP instead of TCP?',
    options: ['Always', 'When speed is more important than reliability (streaming, gaming, VoIP)', 'Never', 'Only for emails'],
    correctAnswer: 1,
    explanation: 'UDP is connectionless and fast but unreliable and unordered. Use for DNS, video streaming, online gaming where speed matters more than perfect delivery.'
  },
  {
    id: 29,
    topic: 'CN',
    subtopic: 'Networking',
    difficulty: 'Easy',
    question: 'What operates at Layer 2 (Data Link)?',
    options: ['Hub', 'Switch', 'Router', 'Modem'],
    correctAnswer: 1,
    explanation: 'Switch operates at Layer 2, using MAC addresses to forward frames. Hub broadcasts (Layer 1). Router routes using IP (Layer 3).'
  },

  // HR MCQs
  {
    id: 30,
    topic: 'HR',
    subtopic: 'Interview',
    difficulty: 'Easy',
    question: 'What should be the structure of "Tell me about yourself"?',
    options: ['Random information', 'Present (current role/skills) → Past (experience) → Future (goals)', 'Only technical skills', 'Personal life details'],
    correctAnswer: 1,
    explanation: 'Best structure: Start with present role, move to relevant past experience, conclude with future aspirations and how this role fits your goals.'
  },
  {
    id: 31,
    topic: 'HR',
    subtopic: 'Strengths & Weakness',
    difficulty: 'Medium',
    question: 'How should you answer "What is your greatest weakness?"',
    options: ['Say you have no weaknesses', 'Pick a genuine weakness and explain how you\'re improving', 'Avoid the question', 'Talk about a non-work weakness'],
    correctAnswer: 1,
    explanation: 'Pick a genuine, non-critical weakness and show self-awareness by explaining what you\'ve learned and how you\'re improving upon it.'
  },
  {
    id: 32,
    topic: 'HR',
    subtopic: 'Goals',
    difficulty: 'Easy',
    question: 'What should your 5-year goal be?',
    options: ['Vague aspirations', 'Specific, realistic, role-relevant goals with passion for the field', 'Just making money', 'Changing careers'],
    correctAnswer: 1,
    explanation: 'Show specific, achievable goals aligned with the industry and company. Demonstrate commitment to growth and continuous learning.'
  },
  {
    id: 33,
    topic: 'HR',
    subtopic: 'Teamwork',
    difficulty: 'Medium',
    question: 'What method is recommended for describing teamwork scenarios?',
    options: ['Storytelling without details', 'STAR method (Situation, Task, Action, Result)', 'Just list skills', 'Avoid examples'],
    correctAnswer: 1,
    explanation: 'STAR method: Set the Situation, describe the Task, explain your Action, and highlight the Result. This makes answers structured and compelling.'
  },
  {
    id: 34,
    topic: 'HR',
    subtopic: 'Conflict',
    difficulty: 'Medium',
    question: 'How should you handle questions about conflicts?',
    options: ['Say you\'ve never had conflicts', 'Use STAR and show you handle conflicts maturely with open communication', 'Blame the other person', 'Avoid full responsibility'],
    correctAnswer: 1,
    explanation: 'Show ability to handle conflict maturely: acknowledge the disagreement, explain your approach (communication, finding common ground), and positive outcome.'
  },
  {
    id: 35,
    topic: 'HR',
    subtopic: 'Motivation',
    difficulty: 'Easy',
    question: 'Why should you research the company before an interview?',
    options: ['It\'s optional', 'To give specific, genuine reasons for joining; to show genuine interest', 'To memorize facts', 'Not necessary'],
    correctAnswer: 1,
    explanation: 'Research shows genuine interest. Mention specific products, culture, values, or achievements that align with your goals. Avoid generic answers.'
  },
  {
    id: 36,
    topic: 'HR',
    subtopic: 'Questions',
    difficulty: 'Medium',
    question: 'What should you ask as your counter-questions to the interviewer?',
    options: ['Questions about salary only', 'Questions about role growth, team culture, projects, expectations, company goals', 'Nothing', 'Only repeat their words'],
    correctAnswer: 1,
    explanation: 'Ask thoughtful questions showing genuine interest: role responsibilities, team structure, success metrics, company culture. Avoid salary initially.'
  },
];

export const mcqTopics = ['All', 'DSA', 'OS', 'DBMS', 'CN', 'HR'];
export const mcqDifficulties = ['All', 'Easy', 'Medium', 'Hard'];
