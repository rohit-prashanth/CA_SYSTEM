export function imageHandler(this: any) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (!base64) return;

      const range = this.quill.getSelection(true);

      // Insert our custom ResizableImage blot with base64
      this.quill.insertEmbed(range.index, 'resizableImage', base64, 'user');
      this.quill.setSelection(range.index + 1, 0);
    };
    reader.readAsDataURL(file); // convert file → base64
  };
}
