class MaxHeap {
  static DEFAULT_SIZE = 1023

  /**
   * Create a new empty max heap of a given size, optionally from an existing array
   * 
   * @param {number} [size=1023] Maximum capacity of the queue
   * @param {{priority: number, element: *}[]} [fromArray] Build the heap from this array instead. The given array must be 1-indexed, and records must have the given form.
   */
  constructor({ size = this.constructor.DEFAULT_SIZE, fromArray } = {}) {
    if (fromArray) {
      this._storage = fromArray;
      this._size = fromArray.length - 1;
      this._count = this._size;
      this._buildheap();

    } else { // we were not passed an array with stuff in it (so just build an empty heap)
      this.size = size;

      // Create storage array with sentinel
      this._storage = [null];

      // Add record slots to storage array
      for (let i = 1; i <= size; i += 1) {
        this._storage.push({ priority: undefined, element: undefined });
      }

      // Last used index will always be at count
      this._count = 0;
    }
  }

  /**
   * Use a heap to sort an array in-place in n*log(n) time
   * 
   * @param {{priority: number, element: *}[]} [array] Data to sort. The given array must be 1-indexed, and records must have the given form.
   */
  static heapsort(array) {
    const heap = new MaxHeap({ fromArray: array });
    heap.sort();
  }

  _left(i) {
    return 2 * i;
  }

  _right(i) {
    return 2 * i + 1;
  }

  _parent(i) {
    return Math.floor(i / 2);
  }

  _swap(i, j) {
    // Note: in a language like C, Java or Rust, where the array is full of records
    // instead of references to records, we would need to swap the priority and
    // the reference to the element instead of the records themselves.
    const temp = this._storage[i];
    this._storage[i] = this._storage[j];
    this._storage[j] = temp;
  }

  _float(i) {
    // compare your priority against your parent's priority
    // repeat until not higher than parent, or has become root
    const priority = (j) => this._storage[j].priority;

    let p = this._parent(i);
    while (p > 0 && priority(i) > priority(p)) {
      this._swap(i, p);

      i = p;
      p = this._parent(i);
    }
  }

  _sink(i) {
    // i is the index to sink
    // compare the priorities and swap with the largest child if necessary
    const inBounds = (j) => j <= this._count;
    const priority = (j) => this._storage[j].priority;

    let finished = false;
    while (!finished) { 
      const l = this._left(i);
      const r = this._right(i);

      let largestChildIndex = i;
      if(inBounds(l) && priority(l) > priority(i)) { // if your left child is larger than your right child
        largestChildIndex = l;
      } 
      
      if (inBounds(r) && priority(r) > priority(largestChildIndex)){
        largestChildIndex = r;
      } 
      
      if (largestChildIndex === i) {
        finished = true;
      } else {
        this._swap(i, largestChildIndex);
        i = largestChildIndex;
      }
    }
  }

    /*
    Takes in an un-ordered array.  
    Takes everything prior to the midpoint and sinks it
    */

  _buildheap() {
   let workingIndex = Math.floor(this._size / 2); // starts at the midpoint
   for (let i = workingIndex; i > 0; i -= 1) {
    this._sink(i);
  }
  }

  /**
   * Add a record to the queue with a given priority
   * 
   * @param {number} priority Priority of the record
   * @param {*} element Data to store in this record
   * @throws If the heap is full
   */
  insert(priority, element) {
    if(this._count === this.size) {
      throw new Error("no more for me thanks i'm full")
    }
    this._count += 1;
    this._storage[this._count].priority = priority;
    this._storage[this._count].element = element;
    // console.log(`Inserting Priority ${this._storage[this._count].priority} `)
    this._float(this._count);
    // this.print()
  }

  /**
   * Remove and return the record with the highest priority
   * 
   * @returns {*} The data stored in the highest-priority record, or undefined if the queue is empty
   */
  removeMax() {
    // swap the root and the last record, "remove" the last record by changing the heapSize
    if (this._count === 0) {return undefined;}
  
    const temp = this._storage[1].element;
    this._storage[1].element = undefined;

    this._swap(1, this._count);
    this._count -= 1;
    this._sink(1);

    return temp;
  }

  print() {
    const validNodes = this._storage.filter((node, i) => {
      if((i > 0) && (i <= this._count)) {
        return true;
      }
    })
    console.log(validNodes.map((node) => { return node.priority }))
  }

  /** 
   * How many records are in the priority queue?
   * 
   * @returns {number} Record count
   */
  count() {
    return this._count;
  }

  /**
   * Turn this max heap into a sorted array
   * 
   * Destroys the max heap in the process - insert, removeMax, etc will NOT
   * work after this function has been run
   * 
   * @returns Sorted storage array. Note that the array is 1-indexed (so the first element is null)
   */
  sort() {
    for (let i = this._count; i > 0; i -= 1) {
      this._swap(1, this._count);
      this._count -= 1;
      this._sink(1);
    }
    return this._storage;
  }

}

export default MaxHeap;
