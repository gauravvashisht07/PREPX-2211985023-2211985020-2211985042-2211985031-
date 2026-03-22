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
  id: 31,
  topic: 'OS',
  subtopic: 'Processes',
  difficulty: 'Easy',
  question: 'What is a process?',
  options: ['Program in execution', 'Compiled code', 'Thread', 'CPU'],
  correctAnswer: 0,
  explanation: 'A process is a program currently being executed.'
},
{
  id: 32,
  topic: 'OS',
  subtopic: 'Processes',
  difficulty: 'Easy',
  question: 'What is a thread?',
  options: ['Independent program', 'Lightweight process', 'Memory unit', 'CPU'],
  correctAnswer: 1,
  explanation: 'Thread is a lightweight process sharing memory.'
},
{
  id: 33,
  topic: 'OS',
  subtopic: 'Processes',
  difficulty: 'Medium',
  question: 'PCB stands for?',
  options: ['Process Control Block', 'Program Control Block', 'Process Code Base', 'None'],
  correctAnswer: 0,
  explanation: 'PCB stores process-related information.'
},
{
  id: 34,
  topic: 'OS',
  subtopic: 'Scheduling',
  difficulty: 'Easy',
  question: 'FCFS stands for?',
  options: ['First Come First Serve', 'Fast CPU First Serve', 'First CPU First Serve', 'None'],
  correctAnswer: 0,
  explanation: 'Processes are executed in order of arrival.'
},
{
  id: 35,
  topic: 'OS',
  subtopic: 'Scheduling',
  difficulty: 'Medium',
  question: 'Which scheduling is preemptive?',
  options: ['FCFS', 'SJF', 'Round Robin', 'FIFO'],
  correctAnswer: 2,
  explanation: 'Round Robin uses time quantum → preemptive.'
},
{
  id: 36,
  topic: 'OS',
  subtopic: 'Scheduling',
  difficulty: 'Medium',
  question: 'Shortest Job First is?',
  options: ['Preemptive', 'Non-preemptive', 'Both', 'None'],
  correctAnswer: 1,
  explanation: 'Basic SJF is non-preemptive.'
},
{
  id: 37,
  topic: 'OS',
  subtopic: 'Scheduling',
  difficulty: 'Medium',
  question: 'Time quantum is used in?',
  options: ['FCFS', 'SJF', 'Round Robin', 'Priority'],
  correctAnswer: 2,
  explanation: 'RR scheduling uses time slice.'
},
{
  id: 38,
  topic: 'OS',
  subtopic: 'Memory',
  difficulty: 'Easy',
  question: 'What is RAM?',
  options: ['Permanent memory', 'Volatile memory', 'Disk memory', 'Cache'],
  correctAnswer: 1,
  explanation: 'RAM is volatile memory.'
},
{
  id: 39,
  topic: 'OS',
  subtopic: 'Memory',
  difficulty: 'Medium',
  question: 'Virtual memory is?',
  options: ['Faster RAM', 'Disk used as RAM', 'Cache memory', 'Register'],
  correctAnswer: 1,
  explanation: 'Disk acts as extension of RAM.'
},
{
  id: 40,
  topic: 'OS',
  subtopic: 'Memory',
  difficulty: 'Medium',
  question: 'Paging avoids?',
  options: ['Deadlock', 'External fragmentation', 'Internal fragmentation', 'Starvation'],
  correctAnswer: 1,
  explanation: 'Paging removes external fragmentation.'
},
{
  id: 41,
  topic: 'OS',
  subtopic: 'Memory',
  difficulty: 'Medium',
  question: 'Page fault occurs when?',
  options: ['Page in RAM', 'Page not in RAM', 'CPU idle', 'Disk error'],
  correctAnswer: 1,
  explanation: 'Page not present in memory.'
},
{
  id: 42,
  topic: 'OS',
  subtopic: 'Memory',
  difficulty: 'Hard',
  question: 'Thrashing means?',
  options: ['Fast execution', 'More paging than execution', 'CPU idle', 'Disk crash'],
  correctAnswer: 1,
  explanation: 'System spends more time paging.'
},
{
  id: 43,
  topic: 'OS',
  subtopic: 'Deadlock',
  difficulty: 'Medium',
  question: 'Deadlock occurs when?',
  options: ['One process waits', 'Circular wait exists', 'CPU idle', 'No memory'],
  correctAnswer: 1,
  explanation: 'Circular wait is key condition.'
},
{
  id: 44,
  topic: 'OS',
  subtopic: 'Deadlock',
  difficulty: 'Hard',
  question: 'Which is NOT a deadlock condition?',
  options: ['Mutual exclusion', 'Circular wait', 'Preemption allowed', 'Hold and wait'],
  correctAnswer: 2,
  explanation: 'No preemption is required for deadlock.'
},
{
  id: 45,
  topic: 'OS',
  subtopic: 'Deadlock',
  difficulty: 'Medium',
  question: 'Deadlock prevention works by?',
  options: ['Allow all conditions', 'Breaking at least one condition', 'Ignore deadlock', 'Increase memory'],
  correctAnswer: 1,
  explanation: 'Break any Coffman condition.'
},
{
  id: 46,
  topic: 'OS',
  subtopic: 'Synchronization',
  difficulty: 'Medium',
  question: 'Semaphore is?',
  options: ['Variable', 'Synchronization tool', 'Memory unit', 'Thread'],
  correctAnswer: 1,
  explanation: 'Used for process synchronization.'
},
{
  id: 47,
  topic: 'OS',
  subtopic: 'Synchronization',
  difficulty: 'Medium',
  question: 'Binary semaphore value?',
  options: ['0 or 1', '0 to n', 'Only 1', 'Only 0'],
  correctAnswer: 0,
  explanation: 'Binary semaphore = 0 or 1.'
},
{
  id: 48,
  topic: 'OS',
  subtopic: 'Synchronization',
  difficulty: 'Medium',
  question: 'Mutex is used for?',
  options: ['Multiple access', 'Mutual exclusion', 'Scheduling', 'Paging'],
  correctAnswer: 1,
  explanation: 'Only one process accesses resource.'
},
{
  id: 49,
  topic: 'OS',
  subtopic: 'Processes',
  difficulty: 'Easy',
  question: 'Process states include?',
  options: ['Ready, Running, Waiting', 'Only Running', 'Only Ready', 'None'],
  correctAnswer: 0,
  explanation: 'Basic process states.'
},
{
  id: 50,
  topic: 'OS',
  subtopic: 'Processes',
  difficulty: 'Medium',
  question: 'Context switching means?',
  options: ['Changing process', 'Switching CPU state', 'Memory clear', 'Disk read'],
  correctAnswer: 1,
  explanation: 'CPU switches between processes.'
},
{
  id: 51,
  topic: 'OS',
  subtopic: 'Scheduling',
  difficulty: 'Medium',
  question: 'Priority scheduling problem?',
  options: ['Deadlock', 'Starvation', 'Thrashing', 'None'],
  correctAnswer: 1,
  explanation: 'Low priority processes may starve.'
},
{
  id: 52,
  topic: 'OS',
  subtopic: 'Memory',
  difficulty: 'Medium',
  question: 'Internal fragmentation occurs in?',
  options: ['Paging', 'Segmentation', 'Both', 'None'],
  correctAnswer: 0,
  explanation: 'Fixed size blocks cause waste.'
},
{
  id: 53,
  topic: 'OS',
  subtopic: 'Memory',
  difficulty: 'Medium',
  question: 'Segmentation is?',
  options: ['Fixed size', 'Variable size', 'No memory', 'Disk'],
  correctAnswer: 1,
  explanation: 'Segments are variable sized.'
},
{
  id: 54,
  topic: 'OS',
  subtopic: 'Memory',
  difficulty: 'Hard',
  question: 'TLB is used for?',
  options: ['Disk access', 'Faster address translation', 'CPU scheduling', 'Threading'],
  correctAnswer: 1,
  explanation: 'TLB speeds up memory access.'
},
{
  id: 55,
  topic: 'OS',
  subtopic: 'File System',
  difficulty: 'Easy',
  question: 'File system manages?',
  options: ['CPU', 'Files', 'Threads', 'Cache'],
  correctAnswer: 1,
  explanation: 'Manages storage and files.'
},
{
  id: 56,
  topic: 'OS',
  subtopic: 'File System',
  difficulty: 'Medium',
  question: 'Directory structure is?',
  options: ['Flat', 'Hierarchical', 'Both', 'None'],
  correctAnswer: 2,
  explanation: 'Both structures exist.'
},
{
  id: 57,
  topic: 'OS',
  subtopic: 'I/O',
  difficulty: 'Medium',
  question: 'Interrupt is?',
  options: ['Signal to CPU', 'Memory', 'Process', 'Thread'],
  correctAnswer: 0,
  explanation: 'Interrupt alerts CPU.'
},
{
  id: 58,
  topic: 'OS',
  subtopic: 'I/O',
  difficulty: 'Medium',
  question: 'DMA stands for?',
  options: ['Direct Memory Access', 'Disk Memory Access', 'Data Memory Access', 'None'],
  correctAnswer: 0,
  explanation: 'Allows direct transfer.'
},
{
  id: 59,
  topic: 'OS',
  subtopic: 'Deadlock',
  difficulty: 'Hard',
  question: 'Banker’s algorithm is used for?',
  options: ['Scheduling', 'Deadlock avoidance', 'Paging', 'Memory'],
  correctAnswer: 1,
  explanation: 'Avoids unsafe states.'
},
{
  id: 60,
  topic: 'OS',
  subtopic: 'Security',
  difficulty: 'Easy',
  question: 'Authentication means?',
  options: ['Permission', 'Verification of identity', 'Encryption', 'Storage'],
  correctAnswer: 1,
  explanation: 'Confirms user identity.'
},

  // DBMS MCQs
 {
  id: 61,
  topic: 'DBMS',
  subtopic: 'Fundamentals',
  difficulty: 'Easy',
  question: 'DBMS stands for?',
  options: ['Database Management System', 'Data Backup System', 'Database Main System', 'None'],
  correctAnswer: 0,
  explanation: 'DBMS is software used to manage databases.'
},
{
  id: 62,
  topic: 'DBMS',
  subtopic: 'Fundamentals',
  difficulty: 'Easy',
  question: 'Which of the following is NOT a DBMS?',
  options: ['MySQL', 'Oracle', 'MongoDB', 'HTML'],
  correctAnswer: 3,
  explanation: 'HTML is a markup language, not a DBMS.'
},
{
  id: 63,
  topic: 'DBMS',
  subtopic: 'Keys',
  difficulty: 'Easy',
  question: 'Primary key must be?',
  options: ['Unique', 'Nullable', 'Duplicate', 'Optional'],
  correctAnswer: 0,
  explanation: 'Primary key uniquely identifies each record.'
},
{
  id: 64,
  topic: 'DBMS',
  subtopic: 'Keys',
  difficulty: 'Medium',
  question: 'Foreign key is used to?',
  options: ['Identify row', 'Link tables', 'Delete rows', 'Sort data'],
  correctAnswer: 1,
  explanation: 'Foreign key establishes relationship between tables.'
},
{
  id: 65,
  topic: 'DBMS',
  subtopic: 'SQL',
  difficulty: 'Easy',
  question: 'Which SQL command is used to retrieve data?',
  options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
  correctAnswer: 2,
  explanation: 'SELECT is used to fetch data.'
},
{
  id: 66,
  topic: 'DBMS',
  subtopic: 'SQL',
  difficulty: 'Easy',
  question: 'Which command is used to delete table?',
  options: ['DELETE', 'DROP', 'REMOVE', 'CLEAR'],
  correctAnswer: 1,
  explanation: 'DROP removes entire table.'
},
{
  id: 67,
  topic: 'DBMS',
  subtopic: 'SQL',
  difficulty: 'Medium',
  question: 'Which clause is used to filter rows?',
  options: ['GROUP BY', 'WHERE', 'ORDER BY', 'HAVING'],
  correctAnswer: 1,
  explanation: 'WHERE filters rows before grouping.'
},
{
  id: 68,
  topic: 'DBMS',
  subtopic: 'SQL',
  difficulty: 'Medium',
  question: 'HAVING clause is used with?',
  options: ['SELECT', 'GROUP BY', 'ORDER BY', 'INSERT'],
  correctAnswer: 1,
  explanation: 'HAVING filters groups.'
},
{
  id: 69,
  topic: 'DBMS',
  subtopic: 'Normalization',
  difficulty: 'Medium',
  question: '1NF ensures?',
  options: ['No duplicates', 'Atomic values', 'No transitive dependency', 'No partial dependency'],
  correctAnswer: 1,
  explanation: '1NF ensures atomic columns.'
},
{
  id: 70,
  topic: 'DBMS',
  subtopic: 'Normalization',
  difficulty: 'Medium',
  question: '2NF removes?',
  options: ['Partial dependency', 'Transitive dependency', 'Duplicates', 'Null values'],
  correctAnswer: 0,
  explanation: '2NF removes partial dependency.'
},
{
  id: 71,
  topic: 'DBMS',
  subtopic: 'Normalization',
  difficulty: 'Medium',
  question: '3NF removes?',
  options: ['Partial dependency', 'Transitive dependency', 'Duplicates', 'Atomic values'],
  correctAnswer: 1,
  explanation: '3NF removes transitive dependency.'
},
{
  id: 72,
  topic: 'DBMS',
  subtopic: 'Transactions',
  difficulty: 'Easy',
  question: 'ACID stands for?',
  options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integrity, Data', 'None', 'All'],
  correctAnswer: 0,
  explanation: 'ACID properties ensure reliability.'
},
{
  id: 73,
  topic: 'DBMS',
  subtopic: 'Transactions',
  difficulty: 'Medium',
  question: 'Atomicity means?',
  options: ['All or nothing', 'Consistency', 'Isolation', 'Durability'],
  correctAnswer: 0,
  explanation: 'Transaction fully completes or fails.'
},
{
  id: 74,
  topic: 'DBMS',
  subtopic: 'Transactions',
  difficulty: 'Medium',
  question: 'Durability ensures?',
  options: ['Temporary storage', 'Permanent storage', 'Isolation', 'Atomicity'],
  correctAnswer: 1,
  explanation: 'Committed data is permanent.'
},
{
  id: 75,
  topic: 'DBMS',
  subtopic: 'Transactions',
  difficulty: 'Hard',
  question: 'Isolation prevents?',
  options: ['Data loss', 'Dirty reads', 'Duplicates', 'Deadlock'],
  correctAnswer: 1,
  explanation: 'Isolation prevents interference between transactions.'
},
{
  id: 76,
  topic: 'DBMS',
  subtopic: 'Joins',
  difficulty: 'Easy',
  question: 'INNER JOIN returns?',
  options: ['All rows', 'Matching rows', 'Left rows', 'Right rows'],
  correctAnswer: 1,
  explanation: 'Only matching rows are returned.'
},
{
  id: 77,
  topic: 'DBMS',
  subtopic: 'Joins',
  difficulty: 'Medium',
  question: 'LEFT JOIN returns?',
  options: ['Matching only', 'Left + matching', 'Right + matching', 'None'],
  correctAnswer: 1,
  explanation: 'All left rows + matching right.'
},
{
  id: 78,
  topic: 'DBMS',
  subtopic: 'Indexing',
  difficulty: 'Medium',
  question: 'Index improves?',
  options: ['Insert speed', 'Search speed', 'Delete speed', 'None'],
  correctAnswer: 1,
  explanation: 'Index speeds up retrieval.'
},
{
  id: 79,
  topic: 'DBMS',
  subtopic: 'Indexing',
  difficulty: 'Hard',
  question: 'B+ Tree is used for?',
  options: ['Sorting', 'Indexing', 'Searching only', 'Graph'],
  correctAnswer: 1,
  explanation: 'Efficient indexing structure.'
},
{
  id: 80,
  topic: 'DBMS',
  subtopic: 'Keys',
  difficulty: 'Medium',
  question: 'Candidate key is?',
  options: ['Any key', 'Possible primary key', 'Foreign key', 'Index'],
  correctAnswer: 1,
  explanation: 'Candidate keys can become primary key.'
},
{
  id: 81,
  topic: 'DBMS',
  subtopic: 'SQL',
  difficulty: 'Easy',
  question: 'UPDATE is used for?',
  options: ['Insert', 'Modify data', 'Delete', 'Read'],
  correctAnswer: 1,
  explanation: 'Updates existing records.'
},
{
  id: 82,
  topic: 'DBMS',
  subtopic: 'SQL',
  difficulty: 'Easy',
  question: 'DELETE removes?',
  options: ['Table', 'Rows', 'Database', 'Index'],
  correctAnswer: 1,
  explanation: 'Deletes rows.'
},
{
  id: 83,
  topic: 'DBMS',
  subtopic: 'SQL',
  difficulty: 'Medium',
  question: 'GROUP BY is used for?',
  options: ['Sorting', 'Grouping rows', 'Deleting', 'Filtering'],
  correctAnswer: 1,
  explanation: 'Groups rows with same values.'
},
{
  id: 84,
  topic: 'DBMS',
  subtopic: 'SQL',
  difficulty: 'Medium',
  question: 'ORDER BY is used for?',
  options: ['Filtering', 'Sorting', 'Grouping', 'Deleting'],
  correctAnswer: 1,
  explanation: 'Sorts results.'
},
{
  id: 85,
  topic: 'DBMS',
  subtopic: 'Transactions',
  difficulty: 'Medium',
  question: 'COMMIT does?',
  options: ['Undo', 'Save changes', 'Delete', 'Rollback'],
  correctAnswer: 1,
  explanation: 'Makes changes permanent.'
},
{
  id: 86,
  topic: 'DBMS',
  subtopic: 'Transactions',
  difficulty: 'Medium',
  question: 'ROLLBACK does?',
  options: ['Save', 'Undo changes', 'Delete table', 'None'],
  correctAnswer: 1,
  explanation: 'Reverts changes.'
},
{
  id: 87,
  topic: 'DBMS',
  subtopic: 'Concurrency',
  difficulty: 'Hard',
  question: 'Deadlock occurs when?',
  options: ['Single process', 'Circular wait', 'No memory', 'CPU idle'],
  correctAnswer: 1,
  explanation: 'Circular wait leads to deadlock.'
},
{
  id: 88,
  topic: 'DBMS',
  subtopic: 'Concurrency',
  difficulty: 'Hard',
  question: 'Lost update problem occurs when?',
  options: ['Two transactions overwrite', 'Single update', 'Delete', 'Insert'],
  correctAnswer: 0,
  explanation: 'Concurrent updates overwrite each other.'
},
{
  id: 89,
  topic: 'DBMS',
  subtopic: 'Architecture',
  difficulty: 'Medium',
  question: 'Three-level architecture includes?',
  options: ['Physical, Logical, View', 'CPU, RAM, Disk', 'Client, Server, DB', 'None'],
  correctAnswer: 0,
  explanation: 'DBMS has 3-level architecture.'
},
{
  id: 90,
  topic: 'DBMS',
  subtopic: 'Architecture',
  difficulty: 'Easy',
  question: 'Schema means?',
  options: ['Data', 'Structure of database', 'Query', 'Index'],
  correctAnswer: 1,
  explanation: 'Schema defines structure.'
},

  // CN MCQs
 {
  id: 91,
  topic: 'CN',
  subtopic: 'Basics',
  difficulty: 'Easy',
  question: 'How many layers are in the OSI model?',
  options: ['5', '6', '7', '4'],
  correctAnswer: 2,
  explanation: 'OSI model consists of 7 layers.'
},
{
  id: 92,
  topic: 'CN',
  subtopic: 'OSI',
  difficulty: 'Easy',
  question: 'Which layer is responsible for routing?',
  options: ['Transport', 'Network', 'Session', 'Data Link'],
  correctAnswer: 1,
  explanation: 'Network layer handles routing.'
},
{
  id: 93,
  topic: 'CN',
  subtopic: 'OSI',
  difficulty: 'Medium',
  question: 'Which layer ensures reliable transmission?',
  options: ['Application', 'Transport', 'Network', 'Physical'],
  correctAnswer: 1,
  explanation: 'Transport layer ensures reliability.'
},
{
  id: 94,
  topic: 'CN',
  subtopic: 'OSI',
  difficulty: 'Easy',
  question: 'Which layer deals with MAC addresses?',
  options: ['Network', 'Transport', 'Data Link', 'Physical'],
  correctAnswer: 2,
  explanation: 'Data Link layer uses MAC addresses.'
},
{
  id: 95,
  topic: 'CN',
  subtopic: 'TCP/IP',
  difficulty: 'Easy',
  question: 'TCP is?',
  options: ['Connectionless', 'Connection-oriented', 'Unreliable', 'Fast only'],
  correctAnswer: 1,
  explanation: 'TCP provides reliable connection.'
},
{
  id: 96,
  topic: 'CN',
  subtopic: 'TCP/IP',
  difficulty: 'Medium',
  question: 'UDP is?',
  options: ['Reliable', 'Connection-oriented', 'Connectionless', 'Slow'],
  correctAnswer: 2,
  explanation: 'UDP is fast and connectionless.'
},
{
  id: 97,
  topic: 'CN',
  subtopic: 'TCP/IP',
  difficulty: 'Medium',
  question: 'Which protocol is used for web?',
  options: ['FTP', 'HTTP', 'SMTP', 'DNS'],
  correctAnswer: 1,
  explanation: 'HTTP is used for web communication.'
},
{
  id: 98,
  topic: 'CN',
  subtopic: 'HTTP',
  difficulty: 'Easy',
  question: 'HTTP stands for?',
  options: ['Hyper Transfer Text Protocol', 'HyperText Transfer Protocol', 'High Transfer Protocol', 'None'],
  correctAnswer: 1,
  explanation: 'Standard web protocol.'
},
{
  id: 99,
  topic: 'CN',
  subtopic: 'HTTP',
  difficulty: 'Medium',
  question: 'Which method is used to send data?',
  options: ['GET', 'POST', 'PUT', 'DELETE'],
  correctAnswer: 1,
  explanation: 'POST sends data to server.'
},
{
  id: 100,
  topic: 'CN',
  subtopic: 'HTTP',
  difficulty: 'Medium',
  question: 'GET method is used for?',
  options: ['Send data', 'Retrieve data', 'Delete data', 'Update data'],
  correctAnswer: 1,
  explanation: 'GET retrieves data.'
},
{
  id: 101,
  topic: 'CN',
  subtopic: 'DNS',
  difficulty: 'Easy',
  question: 'DNS converts?',
  options: ['IP to domain', 'Domain to IP', 'Binary', 'Text'],
  correctAnswer: 1,
  explanation: 'Resolves domain names to IP.'
},
{
  id: 102,
  topic: 'CN',
  subtopic: 'DNS',
  difficulty: 'Easy',
  question: 'DNS uses which port?',
  options: ['80', '443', '53', '25'],
  correctAnswer: 2,
  explanation: 'Port 53 is used.'
},
{
  id: 103,
  topic: 'CN',
  subtopic: 'IP',
  difficulty: 'Medium',
  question: 'IPv4 address size?',
  options: ['16 bit', '32 bit', '64 bit', '128 bit'],
  correctAnswer: 1,
  explanation: 'IPv4 uses 32-bit addressing.'
},
{
  id: 104,
  topic: 'CN',
  subtopic: 'IP',
  difficulty: 'Medium',
  question: 'IPv6 address size?',
  options: ['32 bit', '64 bit', '128 bit', '256 bit'],
  correctAnswer: 2,
  explanation: 'IPv6 uses 128-bit addressing.'
},
{
  id: 105,
  topic: 'CN',
  subtopic: 'Networking',
  difficulty: 'Easy',
  question: 'Which device operates at Layer 2?',
  options: ['Router', 'Switch', 'Hub', 'Modem'],
  correctAnswer: 1,
  explanation: 'Switch works at Data Link layer.'
},
{
  id: 106,
  topic: 'CN',
  subtopic: 'Networking',
  difficulty: 'Easy',
  question: 'Router operates at?',
  options: ['Layer 2', 'Layer 3', 'Layer 4', 'Layer 1'],
  correctAnswer: 1,
  explanation: 'Router works at Network layer.'
},
{
  id: 107,
  topic: 'CN',
  subtopic: 'Networking',
  difficulty: 'Medium',
  question: 'Hub works at?',
  options: ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 4'],
  correctAnswer: 0,
  explanation: 'Hub is Physical layer device.'
},
{
  id: 108,
  topic: 'CN',
  subtopic: 'TCP/IP',
  difficulty: 'Medium',
  question: '3-way handshake includes?',
  options: ['SYN, ACK, FIN', 'SYN, SYN-ACK, ACK', 'ACK, FIN, SYN', 'None'],
  correctAnswer: 1,
  explanation: 'Establishes TCP connection.'
},
{
  id: 109,
  topic: 'CN',
  subtopic: 'Security',
  difficulty: 'Medium',
  question: 'HTTPS uses?',
  options: ['SSL/TLS', 'FTP', 'DNS', 'SMTP'],
  correctAnswer: 0,
  explanation: 'HTTPS is secure HTTP.'
},
{
  id: 110,
  topic: 'CN',
  subtopic: 'Security',
  difficulty: 'Medium',
  question: 'Firewall is used for?',
  options: ['Routing', 'Security', 'Storage', 'Computation'],
  correctAnswer: 1,
  explanation: 'Controls network traffic.'
},
{
  id: 111,
  topic: 'CN',
  subtopic: 'Protocols',
  difficulty: 'Easy',
  question: 'SMTP is used for?',
  options: ['Web', 'Email sending', 'File transfer', 'DNS'],
  correctAnswer: 1,
  explanation: 'SMTP sends emails.'
},
{
  id: 112,
  topic: 'CN',
  subtopic: 'Protocols',
  difficulty: 'Easy',
  question: 'FTP is used for?',
  options: ['File transfer', 'Web', 'Email', 'DNS'],
  correctAnswer: 0,
  explanation: 'FTP transfers files.'
},
{
  id: 113,
  topic: 'CN',
  subtopic: 'Protocols',
  difficulty: 'Medium',
  question: 'POP3 is used for?',
  options: ['Sending mail', 'Receiving mail', 'Routing', 'DNS'],
  correctAnswer: 1,
  explanation: 'POP3 receives emails.'
},
{
  id: 114,
  topic: 'CN',
  subtopic: 'Protocols',
  difficulty: 'Medium',
  question: 'IMAP differs from POP3 by?',
  options: ['Faster', 'Keeps mail on server', 'Deletes mail', 'None'],
  correctAnswer: 1,
  explanation: 'IMAP keeps mail on server.'
},
{
  id: 115,
  topic: 'CN',
  subtopic: 'Networking',
  difficulty: 'Medium',
  question: 'Bandwidth means?',
  options: ['Speed', 'Capacity', 'Delay', 'Loss'],
  correctAnswer: 1,
  explanation: 'Bandwidth is data capacity.'
},
{
  id: 116,
  topic: 'CN',
  subtopic: 'Networking',
  difficulty: 'Medium',
  question: 'Latency means?',
  options: ['Speed', 'Delay', 'Capacity', 'Loss'],
  correctAnswer: 1,
  explanation: 'Latency is delay.'
},
{
  id: 117,
  topic: 'CN',
  subtopic: 'Error Detection',
  difficulty: 'Medium',
  question: 'CRC is used for?',
  options: ['Encryption', 'Error detection', 'Routing', 'Compression'],
  correctAnswer: 1,
  explanation: 'CRC detects errors.'
},
{
  id: 118,
  topic: 'CN',
  subtopic: 'Error Detection',
  difficulty: 'Medium',
  question: 'Parity bit is used for?',
  options: ['Error detection', 'Routing', 'Encryption', 'Storage'],
  correctAnswer: 0,
  explanation: 'Simple error detection method.'
},
{
  id: 119,
  topic: 'CN',
  subtopic: 'Wireless',
  difficulty: 'Easy',
  question: 'Wi-Fi uses?',
  options: ['Radio waves', 'Infrared', 'Wires', 'Fiber'],
  correctAnswer: 0,
  explanation: 'Wireless communication.'
},
{
  id: 120,
  topic: 'CN',
  subtopic: 'Wireless',
  difficulty: 'Medium',
  question: 'Bluetooth range is?',
  options: ['Short', 'Long', 'Medium', 'Unlimited'],
  correctAnswer: 0,
  explanation: 'Bluetooth is short-range.'
},

  // HR MCQs
  {
  id: 121,
  topic: 'HR',
  subtopic: 'Interview',
  difficulty: 'Easy',
  question: 'What should be the structure of "Tell me about yourself"?',
  options: ['Random information', 'Present → Past → Future', 'Only personal life', 'Only technical skills'],
  correctAnswer: 1,
  explanation: 'Best structure is Present → Past → Future.'
},
{
  id: 122,
  topic: 'HR',
  subtopic: 'Interview',
  difficulty: 'Easy',
  question: 'First impression in interview depends on?',
  options: ['Clothes only', 'Communication + body language', 'Marks only', 'Luck'],
  correctAnswer: 1,
  explanation: 'Communication and body language matter most.'
},
{
  id: 123,
  topic: 'HR',
  subtopic: 'Strengths',
  difficulty: 'Easy',
  question: 'How should you describe your strengths?',
  options: ['Random', 'With examples', 'Only list', 'Avoid'],
  correctAnswer: 1,
  explanation: 'Always support strengths with examples.'
},
{
  id: 124,
  topic: 'HR',
  subtopic: 'Weakness',
  difficulty: 'Medium',
  question: 'Best way to answer weakness?',
  options: ['Say none', 'Fake weakness', 'Real + improvement', 'Avoid'],
  correctAnswer: 2,
  explanation: 'Show improvement mindset.'
},
{
  id: 125,
  topic: 'HR',
  subtopic: 'Goals',
  difficulty: 'Easy',
  question: '5-year goal should be?',
  options: ['Random', 'Clear & realistic', 'Only money', 'Change field'],
  correctAnswer: 1,
  explanation: 'Should be specific and realistic.'
},
{
  id: 126,
  topic: 'HR',
  subtopic: 'Company',
  difficulty: 'Easy',
  question: 'Why research company before interview?',
  options: ['Optional', 'Show interest', 'Time pass', 'Not needed'],
  correctAnswer: 1,
  explanation: 'Shows genuine interest.'
},
{
  id: 127,
  topic: 'HR',
  subtopic: 'Motivation',
  difficulty: 'Medium',
  question: 'Why do you want this job?',
  options: ['Money', 'Learning + growth', 'Random', 'No reason'],
  correctAnswer: 1,
  explanation: 'Focus on growth and alignment.'
},
{
  id: 128,
  topic: 'HR',
  subtopic: 'Teamwork',
  difficulty: 'Medium',
  question: 'Best way to explain teamwork?',
  options: ['General talk', 'STAR method', 'Avoid example', 'Only theory'],
  correctAnswer: 1,
  explanation: 'STAR gives structured answer.'
},
{
  id: 129,
  topic: 'HR',
  subtopic: 'Conflict',
  difficulty: 'Medium',
  question: 'How to handle conflict question?',
  options: ['Blame others', 'Avoid', 'Explain calmly', 'Ignore'],
  correctAnswer: 2,
  explanation: 'Show maturity and communication.'
},
{
  id: 130,
  topic: 'HR',
  subtopic: 'Behavior',
  difficulty: 'Easy',
  question: 'What shows professionalism?',
  options: ['Late arrival', 'Confidence + respect', 'Casual talk', 'Silence'],
  correctAnswer: 1,
  explanation: 'Professional behavior matters.'
},
{
  id: 131,
  topic: 'HR',
  subtopic: 'Questions',
  difficulty: 'Medium',
  question: 'Should you ask questions to interviewer?',
  options: ['No', 'Yes', 'Only salary', 'Optional'],
  correctAnswer: 1,
  explanation: 'Shows interest in role.'
},
{
  id: 132,
  topic: 'HR',
  subtopic: 'Questions',
  difficulty: 'Medium',
  question: 'Best counter question?',
  options: ['Salary only', 'Growth & role', 'Nothing', 'Random'],
  correctAnswer: 1,
  explanation: 'Ask about growth and expectations.'
},
{
  id: 133,
  topic: 'HR',
  subtopic: 'Salary',
  difficulty: 'Medium',
  question: 'When to discuss salary?',
  options: ['Start', 'End', 'Never', 'Random'],
  correctAnswer: 1,
  explanation: 'Usually discussed at end.'
},
{
  id: 134,
  topic: 'HR',
  subtopic: 'Behavior',
  difficulty: 'Easy',
  question: 'Eye contact shows?',
  options: ['Fear', 'Confidence', 'Anger', 'Confusion'],
  correctAnswer: 1,
  explanation: 'Eye contact builds confidence.'
},
{
  id: 135,
  topic: 'HR',
  subtopic: 'Mistakes',
  difficulty: 'Medium',
  question: 'If you don’t know answer?',
  options: ['Fake', 'Say don’t know', 'Avoid', 'Guess randomly'],
  correctAnswer: 1,
  explanation: 'Honesty is better.'
},
{
  id: 136,
  topic: 'HR',
  subtopic: 'Learning',
  difficulty: 'Medium',
  question: 'How to show learning attitude?',
  options: ['Ignore', 'Examples', 'Fake', 'Avoid'],
  correctAnswer: 1,
  explanation: 'Show real learning experiences.'
},
{
  id: 137,
  topic: 'HR',
  subtopic: 'Pressure',
  difficulty: 'Medium',
  question: 'Handling pressure?',
  options: ['Avoid', 'Explain strategy', 'Panic', 'Ignore'],
  correctAnswer: 1,
  explanation: 'Explain calmly with example.'
},
{
  id: 138,
  topic: 'HR',
  subtopic: 'Leadership',
  difficulty: 'Medium',
  question: 'Leadership means?',
  options: ['Control', 'Guide team', 'Order', 'None'],
  correctAnswer: 1,
  explanation: 'Leader guides team.'
},
{
  id: 139,
  topic: 'HR',
  subtopic: 'Communication',
  difficulty: 'Easy',
  question: 'Good communication means?',
  options: ['Complex words', 'Clear & simple', 'Fast talking', 'Silence'],
  correctAnswer: 1,
  explanation: 'Clarity is key.'
},
{
  id: 140,
  topic: 'HR',
  subtopic: 'Behavior',
  difficulty: 'Easy',
  question: 'Smile during interview?',
  options: ['No', 'Yes', 'Optional', 'Never'],
  correctAnswer: 1,
  explanation: 'Creates positive impression.'
},
{
  id: 141,
  topic: 'HR',
  subtopic: 'Failure',
  difficulty: 'Medium',
  question: 'How to explain failure?',
  options: ['Blame', 'Learning experience', 'Avoid', 'Ignore'],
  correctAnswer: 1,
  explanation: 'Show growth from failure.'
},
{
  id: 142,
  topic: 'HR',
  subtopic: 'Decision',
  difficulty: 'Medium',
  question: 'Decision making shows?',
  options: ['Confusion', 'Leadership', 'Fear', 'None'],
  correctAnswer: 1,
  explanation: 'Shows leadership ability.'
},
{
  id: 143,
  topic: 'HR',
  subtopic: 'Teamwork',
  difficulty: 'Medium',
  question: 'Team success depends on?',
  options: ['Individual', 'Collaboration', 'Luck', 'None'],
  correctAnswer: 1,
  explanation: 'Teamwork is key.'
},
{
  id: 144,
  topic: 'HR',
  subtopic: 'Attitude',
  difficulty: 'Easy',
  question: 'Positive attitude means?',
  options: ['Negative thinking', 'Optimistic mindset', 'Ignore', 'Anger'],
  correctAnswer: 1,
  explanation: 'Positive mindset helps growth.'
},
{
  id: 145,
  topic: 'HR',
  subtopic: 'Time Management',
  difficulty: 'Medium',
  question: 'Time management helps in?',
  options: ['Delay', 'Efficiency', 'Confusion', 'None'],
  correctAnswer: 1,
  explanation: 'Improves productivity.'
},
{
  id: 146,
  topic: 'HR',
  subtopic: 'Career',
  difficulty: 'Easy',
  question: 'Career goal should be?',
  options: ['Vague', 'Clear', 'Random', 'None'],
  correctAnswer: 1,
  explanation: 'Clarity is important.'
},
{
  id: 147,
  topic: 'HR',
  subtopic: 'Adaptability',
  difficulty: 'Medium',
  question: 'Adaptability means?',
  options: ['Rigid', 'Flexible', 'Slow', 'None'],
  correctAnswer: 1,
  explanation: 'Ability to adjust.'
},
{
  id: 148,
  topic: 'HR',
  subtopic: 'Ethics',
  difficulty: 'Medium',
  question: 'Work ethics means?',
  options: ['Ignore work', 'Professional behavior', 'Delay', 'None'],
  correctAnswer: 1,
  explanation: 'Ethical work practices.'
},
{
  id: 149,
  topic: 'HR',
  subtopic: 'Confidence',
  difficulty: 'Easy',
  question: 'Confidence comes from?',
  options: ['Luck', 'Preparation', 'Guessing', 'None'],
  correctAnswer: 1,
  explanation: 'Preparation builds confidence.'
},
{
  id: 150,
  topic: 'HR',
  subtopic: 'Interview',
  difficulty: 'Medium',
  question: 'Best way to end interview?',
  options: ['Leave quickly', 'Thank interviewer + ask growth', 'No response', 'Ignore'],
  correctAnswer: 1,
  explanation: 'Shows professionalism and interest.'
},
];

export const mcqTopics = ['All', 'DSA', 'OS', 'DBMS', 'CN', 'HR'];
export const mcqDifficulties = ['All', 'Easy', 'Medium', 'Hard'];
