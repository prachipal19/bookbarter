import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book } from '../book.model';
import { ListingService } from '../listing.services';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  @Input() bookObj: Book = {
    _id: '',
    ISBN: '',
    img: '',
    title: '',
    author: '',
    category: '',
    inventory: 0,
    isExchange: false
  };
  @Input() isUpdateMode!: boolean;
  isLoading: boolean = false;
  bookForm!: FormGroup;
  submitted: boolean = false;
  constructor(private snackBar: MatSnackBar, private listingService: ListingService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.fb.group({
      _id: [''],
      ISBN: ['', Validators.required],
      img: [''],
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: [''],
      inventory: [0, Validators.min(0)],
      isExchange: [false]
    });

    this.bookForm.setValue({
      _id: this.bookObj._id,
      ISBN: this.bookObj.ISBN,
      img: this.bookObj.img,
      title: this.bookObj.title,
      author: this.bookObj.author,
      category: this.bookObj.category,
      inventory: this.bookObj.inventory,
      isExchange: this.bookObj.isExchange
    });
  }

  toggleMode() {
    this.isUpdateMode = !this.isUpdateMode;
    if (!this.isUpdateMode) {
      this.bookForm.reset({
        _id: '',
        ISBN: '',
        img: '',
        title: '',
        author: '',
        category: '',
        inventory: 0,
        isExchange: false
      });
    } else {
      this.bookForm.setValue({
        _id: this.bookObj._id,
        ISBN: this.bookObj.ISBN,
        img: this.bookObj.img,
        title: this.bookObj.title,
        author: this.bookObj.author,
        category: this.bookObj.category,
        inventory: this.bookObj.inventory,
        isExchange: this.bookObj.isExchange
      });
    }
  }

  addOrUpdateBook() {
    this.submitted = true;
    this.isLoading = true;
    if (!this.bookForm.valid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.isLoading = false;
      return;
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.snackBar.open('Authentication token is missing. Please log in.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.isLoading = false;
      return;
    }

    if (this.isUpdateMode && this.bookForm.value._id) {
      this.listingService.updateBook(this.bookForm.value.ISBN, this.bookForm.value, token).subscribe({
        next: (updatedBook) => {
          this.snackBar.open('Book updated successfully!', 'Close', { duration: 3000, verticalPosition: 'top' });
          this.isLoading = false;
          this.bookForm.reset(); // Optionally reset the form
        },
        error: (error) => {
          this.snackBar.open('Failed to update book. Please try again.', 'Close', { duration: 3000, verticalPosition: 'top' });
          this.isLoading = false;
        }
      });
    } else {
      this.listingService.addBook(this.bookForm.value, token).subscribe({
        next: (newBook) => {
          this.snackBar.open('Book added successfully!', 'Close', { duration: 3000, verticalPosition: 'top' });
          this.isLoading = false;
          this.bookForm.reset(); // Reset the form after successful addition
        },
        error: (error) => {
          this.snackBar.open('Failed to add book. Please try again.', 'Close', { duration: 3000, verticalPosition: 'top' });
          this.isLoading = false;
        }
      });
    }
  }
}
