const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  resourceType: {
    type: String,
    required: [true, 'Resource type is required'],
    enum: ['DONATION', 'VOLUNTEER', 'BENEFICIARY'],
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED'],
    default: 'PENDING',
    uppercase: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: [0, 'Quantity cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['FOOD', 'CLOTHING', 'EDUCATION', 'HEALTHCARE', 'SHELTER', 'OTHER'],
    uppercase: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Contact name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    }
  },
  value: {
    type: Number,
    min: [0, 'Value cannot be negative']
  },
  availabilityDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
resourceSchema.index({ resourceType: 1, status: 1 });
resourceSchema.index({ category: 1 });
resourceSchema.index({ 'contactInfo.email': 1 });

module.exports = mongoose.model('Resource', resourceSchema);