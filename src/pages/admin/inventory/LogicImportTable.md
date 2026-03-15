# TASK: Implement Local Excel Import Preview & Validation for Inventory Table

## 1. Overview

Write the frontend logic and UI components to handle an Excel import feature for an Inventory Management system. The core requirement is to **preview and validate** the imported data locally before overwriting the existing table state.
**Crucial Note:** NO API calls or database pushes. This is strictly a local state overwrite (it is expected that data will be lost on page reload/F5).

## 2. UI/UX Flow Requirements

1. **Upload Trigger:** User uploads an Excel file.
2. **Preview Mode:** - Hide the current main inventory table.
   - Display a NEW "Preview Table" in its place.
   - The Preview Table must look similar to the main table but with an added **Checkbox column** at the very beginning of each row.
3. **Inline Error Display:** Just like the current system blocks invalid typing, the Preview Table must display validation errors directly under/inside the corresponding invalid rows or cells.
4. **Action Buttons:**
   - **"Accept Changes":** Only takes the checked (and valid) rows from the Preview Table and strictly OVERWRITES the main table state.
   - **"Cancel":** Discards the preview and restores the original main table view.

## 3. Validation Rules (Strict 4 Conditions)

Implement a validation function that runs immediately after parsing the Excel file. It must check the following conditions:

- **Condition 1: Wrong Index/Schema.** Check if the Excel columns/headers match the required schema index. If the format/index is totally wrong, reject the file or flag the columns.
- **Condition 2: Duplicate Data.** Check if the imported rows have duplicated identifiers (e.g., ID/SKU) within the Excel file itself OR compared to the existing main table data.
- **Condition 3: New Data Not Allowed.** If the imported data contains items/products that do NOT currently exist in the main inventory state, flag it. Error message: "New data detected."
- **Condition 4: Wrong Data Format.** Validate cell types (e.g., quantity must be a valid number, not a string). Error message: "Wrong format."

## 4. State Management Logic (Framework Agnostic / React-style)

- `mainTableData`: Stores the current active data.
- `previewTableData`: Stores the parsed Excel data along with validation metadata (e.g., `isValid`, `errorMessages[]`).
- `isImportPreviewMode`: Boolean to toggle between Main Table and Preview Table.

## 5. Execution Steps for AI

1. Provide the code for parsing the Excel file (assuming a library like `xlsx` or `papaparse`).
2. Provide the `validateImportedData(parsedData, currentData)` function covering the 4 conditions.
3. Provide the UI Component structure showing how the Preview Table renders errors and the Checkbox.
4. Provide the handler for the "Accept Changes" button to map selected preview data back to the main state.

And REMEMBER DONT NEED TO CHANGE FROM ENGLISH TO VIETNAMESE, u can remove all of those function
