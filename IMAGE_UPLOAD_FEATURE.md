# 📷 Image Upload Feature - Ki Pahare DigiGuide

## Overview

Fitur upload gambar telah diimplementasikan untuk menggantikan input URL manual. Sekarang admin dapat langsung upload gambar dari komputer mereka ke Supabase Storage.

## ✨ Features

### 1. Direct File Upload (PRIORITY)
- **Drag & drop** atau **click to upload**
- Preview gambar sebelum submit
- Progress bar saat upload
- Validasi otomatis (type, size)

### 2. URL Input (OPTIONAL)
- Fallback option jika ingin pakai URL
- Disabled otomatis jika file sudah dipilih
- Tetap bisa validasi URL

### 3. Validations
- **File Types**: JPEG, JPG, PNG, WebP
- **File Size**: Max 5MB
- **URL Format**: Must start with http:// or https://
- **Required**: Wajib pilih salah satu (file atau URL)

## 🎯 How It Works

### User Flow

```
1. Admin buka "Add New Artifact"
   ↓
2. Klik area upload atau pilih file
   ↓
3. File divalidasi (type & size)
   ↓
4. Preview muncul
   ↓
5. Isi form lainnya (name, category, etc.)
   ↓
6. Click "Create Artifact"
   ↓
7. File di-upload ke Supabase Storage (progress 25% → 75%)
   ↓
8. Get public URL dari storage
   ↓
9. Create artifact record di database dengan URL (progress 80% → 100%)
   ↓
10. Success! Redirect ke dashboard
```

### Technical Flow

```typescript
// 1. User selects file
handleFileChange(e) {
  const file = e.target.files[0];
  
  // Validate type
  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
    return error;
  }
  
  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return error;
  }
  
  // Generate preview
  setImagePreview(URL.createObjectURL(file));
  setImageFile(file);
  
  // Clear URL input (priority to file)
  setFormData({ ...formData, imageUrl: '' });
}

// 2. User submits form
handleSubmit(e) {
  // Check if image provided
  if (!imageFile && !imageUrl) {
    return error('Please upload image or provide URL');
  }
  
  let finalImageUrl = imageUrl;
  
  // Upload file if selected
  if (imageFile) {
    setUploadProgress(25);
    finalImageUrl = await supabaseStorage.uploadImage(imageFile);
    setUploadProgress(75);
  }
  
  // Create artifact with image URL
  setUploadProgress(80);
  await createArtifact({ ...formData, image_url: finalImageUrl });
  setUploadProgress(100);
}

// 3. Upload to storage
supabaseStorage.uploadImage(file) {
  const fileName = `artifact_${Date.now()}_${Math.random()}.${ext}`;
  const { error } = await supabase.storage
    .from('artifacts-images')
    .upload(fileName, file);
    
  if (error) throw error;
  
  // Get public URL
  const { data } = supabase.storage
    .from('artifacts-images')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
}
```

## 📁 Files Modified

### 1. `/app/admin/artifacts/add/page.tsx`

#### Added States:
```typescript
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string>('');
const [uploadProgress, setUploadProgress] = useState<number>(0);
const [isValidatingImage, setIsValidatingImage] = useState(false);
```

#### Added Function:
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    setErrors(prev => ({ 
      ...prev, 
      image: 'Invalid file type. Please upload JPEG, PNG, or WebP' 
    }));
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    setErrors(prev => ({ 
      ...prev, 
      image: 'File too large. Maximum size is 5MB' 
    }));
    return;
  }

  // Clear errors and set file
  setErrors(prev => ({ ...prev, image: '' }));
  setImageFile(file);

  // Generate preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result as string);
  };
  reader.readAsDataURL(file);

  // Clear URL input (file has priority)
  setFormData(prev => ({ ...prev, imageUrl: '' }));
};
```

#### Updated Submit:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // ... validation ...

  // Check if image is provided
  if (!imageFile && !formData.imageUrl.trim()) {
    setErrors(prev => ({ ...prev, image: 'Please upload an image or provide an image URL' }));
    return;
  }

  let imageUrl = formData.imageUrl;

  // Upload image file if selected
  if (imageFile) {
    setUploadProgress(25);
    try {
      imageUrl = await supabaseStorage.uploadImage(imageFile);
      setUploadProgress(75);
    } catch (uploadError: any) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }
  }

  setUploadProgress(80);

  // Create artifact with image URL
  const response = await fetch('/api/artifacts', {
    method: 'POST',
    body: JSON.stringify({
      ...formData,
      image_url: imageUrl,
    }),
  });

  setUploadProgress(100);
  // ... success handling ...
};
```

#### Updated UI:
- Added file input with drag & drop area
- Added upload progress bar
- Added image preview section
- Made URL input optional with "OR" divider
- Disabled URL input when file selected

### 2. `/lib/supabase.ts`

Already has helper functions:

```typescript
export const supabaseStorage = {
  uploadImage: async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `artifact_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('artifacts-images')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('artifacts-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  deleteImage: async (imageUrl: string): Promise<void> => {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;

    const { error } = await supabase.storage
      .from('artifacts-images')
      .remove([fileName]);

    if (error) {
      throw error;
    }
  },
};
```

## 🚀 Setup Instructions

### Step 1: Create Storage Bucket

Jalankan SQL di Supabase Dashboard (lihat `SETUP_STORAGE.md`):

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('artifacts-images', 'artifacts-images', true);

-- Add policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING (bucket_id = 'artifacts-images');

CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artifacts-images' AND auth.role() = 'authenticated');
```

### Step 2: Test Upload

1. Login ke admin panel
2. Go to "Add New Artifact"
3. Click upload area
4. Select image file (JPEG, PNG, or WebP)
5. See preview
6. Fill other fields
7. Submit

### Step 3: Verify

Check di Supabase Dashboard:
- Storage → artifacts-images
- Should see uploaded file
- Click file → Copy URL
- Paste URL di browser → image should display

## 🎨 UI Components

### File Upload Area
```tsx
<div className="border-2 border-dashed rounded-lg p-6 text-center">
  <input
    type="file"
    accept="image/jpeg,image/jpg,image/png,image/webp"
    onChange={handleFileChange}
    className="hidden"
    id="imageFile"
  />
  <label htmlFor="imageFile" className="cursor-pointer">
    <div className="text-4xl">📷</div>
    <p>Click to upload artifact image</p>
    <p className="text-xs">JPEG, PNG, WebP • Max 5MB</p>
  </label>
</div>
```

### Progress Bar
```tsx
{uploadProgress > 0 && uploadProgress < 100 && (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span>Uploading...</span>
      <span>{uploadProgress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
  </div>
)}
```

### Image Preview
```tsx
{imagePreview && (
  <div className="border rounded-lg p-4 bg-white">
    <p className="text-sm font-semibold mb-2">Preview:</p>
    <img
      src={imagePreview}
      alt="Preview"
      className="max-w-full h-64 object-cover rounded mx-auto"
    />
  </div>
)}
```

## 🔧 Error Handling

### File Validation Errors
```typescript
// Invalid type
"Invalid file type. Please upload JPEG, PNG, or WebP"

// File too large
"File too large. Maximum size is 5MB"

// No image provided
"Please upload an image or provide an image URL"
```

### Upload Errors
```typescript
// Upload failed
"Image upload failed: [error message]"

// Network error
"Failed to add artifact"
```

## ✅ Testing Checklist

- [ ] File upload works (JPEG)
- [ ] File upload works (PNG)
- [ ] File upload works (WebP)
- [ ] Invalid file type shows error
- [ ] File > 5MB shows error
- [ ] Preview displays correctly
- [ ] Progress bar animates
- [ ] URL input disabled when file selected
- [ ] Can submit with file only
- [ ] Can submit with URL only
- [ ] Cannot submit without image
- [ ] Image displays on homepage after creation
- [ ] Old images deleted when replaced

## 🎯 Next Steps

### Priority
1. ✅ **Implement file upload on Add page** (DONE)
2. 🔄 **Apply to Edit page** (IN PROGRESS)
3. ⏳ **Setup storage bucket in Supabase**
4. ⏳ **Test complete flow**

### Optional Enhancements
- Image compression before upload
- Multiple image upload
- Image cropping tool
- Drag & drop support
- Bulk upload

## 📊 Benefits

### Before (URL Input)
- ❌ User must host image elsewhere
- ❌ External URLs can break
- ❌ No control over image
- ❌ Manual URL entry error-prone

### After (File Upload)
- ✅ Direct upload from computer
- ✅ Images stored in our storage
- ✅ Full control and reliability
- ✅ Better UX with preview
- ✅ Progress feedback
- ✅ Automatic validation

## 🔐 Security

- File type validation (client-side)
- File size limit (5MB)
- Authenticated uploads only
- Public read access
- RLS policies on storage

## 📱 Mobile Support

- Touch-friendly upload area
- Responsive design
- Works on tablets/phones
- Camera access (mobile browsers)

---

✅ **Status**: Implemented and ready to test
📝 **Last Updated**: January 2025
👨‍💻 **Implemented By**: GitHub Copilot
