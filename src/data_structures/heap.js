class MaxHeap {
  static DEFAULT_SIZE = 1023

  /**
   * Create a new empty max heap of a given size, optionally from an existing array
   * 
   * @param {number} [size=1023] Maximum capacity of the queue
   * @param {{priority: number, element: *}[]} [fromArray] Build the heap from this array instead. The given array must be 1-indexed, and records must have the given form.
   */
  constructor({ size = this.constructor.DEFAULT_SIZE, fromArray } = {}) {
    if (fromArray) { // we were passed an array, so build a heap from it
      this._storage = fromArray;
      this.size = fromArray.length - 1;
      this._count = this.size;
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
    if(i === 1) { return }
    let higherPriorityThanParent = this._storage[i].priority > this._storage[this._parent(i)].priority;
    if(higherPriorityThanParent) {
      this._swap(i, this._parent(i)); // if larger, swap the two
      this._float(this._parent(i)) // then float the parent
    }
  }

  _sink(i) {
    // i is the index to sink
    // compare the priorities and swap with the largest child if necessary
    if(i >= this._count) return
    let leftChildPriority = (this._left(i) <= this._count) ? this._storage[this._left(i)].priority : undefined;
    let rightChildPriority = (this._right(i) <= this._count) ? this._storage[this._right(i)].priority : undefined;
    // console.log(`count is ${this._count}`)
    let largestChildIndex;
    if(leftChildPriority >= rightChildPriority) { // if your left child is larger than your right child
      largestChildIndex = this._left(i);
    } else if (leftChildPriority < rightChildPriority){
      largestChildIndex = this._right(i);
    } else {
      if (typeof leftChildPriority === "undefined") {
        largestChildIndex = this._right(i);
      } else if (typeof rightChildPriority === "undefined") {
        largestChildIndex = this._left(i);
      } else {
        return
      }
    }
    // console.log(`My priority is ${this._storage[i].priority}, my largest child (at index ${largestChildIndex}) priority is ${this._storage[largestChildIndex].priority}`)
    try {
      if(this._storage[i].priority < this._storage[largestChildIndex].priority) { /// compare my priority with largest child.
        this._swap(i, largestChildIndex); // if smaller, swap the two
        this._sink(largestChildIndex) // then sink the number again
      } else {
        return;
      }
  
    } catch (e) {
      console.log(`error: ${e.message}`)
      console.log(`Count of ${this._count} vs index of ${i} (size of tree: ${this.size})`)
    }
  }

    /*
    Takes in an un-ordered array.  
    Takes everything prior to the midpoint and sinks it
    */

  _buildheap() {
   let workingIndex = Math.floor(this._count / 2); // starts at the midpoint
   console.log(`building heap array is...`)
   this.print()
    while(workingIndex > 0) {
      this._sink(workingIndex)
      workingIndex--;
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
    this._storage[this._count + 1].priority = priority;
    this._storage[this._count + 1].element = element;
    this._count++;
    this._float(this._count);
  }

  /**
   * Remove and return the record with the highest priority
   * 
   * @returns {*} The data stored in the highest-priority record, or undefined if the queue is empty
   */
  removeMax() {
    // swap the root and the last record, "remove" the last record by changing the heapSize
    if (this._count > 0) {
      this._swap(1, this._count);
      this._count--;
      this._sink(1);

      const temp = this._storage[this._count + 1].element;
      this._storage[this._count + 1].priority = null;
      this._storage[this._count + 1].element = null;

      return temp;
    } else {
      return;
    }
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
    // TODO
    // build heap
    // heapSort
    //. the array is now sorted
  }

}

export default MaxHeap;
