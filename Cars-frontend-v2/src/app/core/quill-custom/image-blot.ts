import Quill from 'quill';

// Cast BlockEmbed as any for TypeScript
const BlockEmbed = Quill.import('blots/block/embed') as any;

// export class ResizableImage extends BlockEmbed {
//   static blotName = 'resizableImage';
//   static tagName = 'div'; // wrapper around <img>

//   static create(value: any) {
//     const wrapper = super.create() as HTMLDivElement;
//     wrapper.classList.add('resizable-image-wrapper');
//     wrapper.style.display = 'inline-block';
//     wrapper.style.resize = 'both';       // native resize handles
//     wrapper.style.overflow = 'hidden';
//     wrapper.style.maxWidth = '100%';
//     wrapper.style.border = '1px dashed #ccc'; // optional visual cue
//     wrapper.style.position = 'relative';

//     // Create the actual <img>
//     const img = document.createElement('img');
//     const src = typeof value === 'string' ? value : value?.url;
//     if (!src) throw new Error('ResizableImage: src not provided');

//     img.setAttribute('src', src);
//     img.style.width = '100%';  // make it scale with wrapper
//     img.style.height = '100%';
//     img.style.display = 'block';
//     img.style.pointerEvents = 'none'; // so wrapper resize works

//     wrapper.appendChild(img);

//     // Store original size
//     img.onload = () => {
//       wrapper.setAttribute('data-original-width', img.naturalWidth.toString());
//       wrapper.setAttribute('data-original-height', img.naturalHeight.toString());
//     };

//     return wrapper;
//   }

//   static value(node: HTMLDivElement) {
//     const img = node.querySelector('img') as HTMLImageElement | null;
//     return img ? img.getAttribute('src') : '';
//   }
// }

// Register the blot globally

export class ResizableImage extends BlockEmbed {
  static blotName = 'resizableImage';
  static tagName = 'div';

  static create(value: any) {
    const wrapper = super.create() as HTMLDivElement;
    wrapper.classList.add('resizable-image-wrapper');

    // Default inline styles
    wrapper.style.display = 'inline-block';
    wrapper.style.resize = 'both';
    wrapper.style.overflow = 'hidden';
    wrapper.style.border = '1px dashed #ccc';
    wrapper.style.position = 'relative';

    // ✅ If a saved width/height exists, apply it
    if (value?.width) {
      wrapper.style.width = value.width + 'px';
    }
    if (value?.height) {
      wrapper.style.height = value.height + 'px';
    }

    const img = document.createElement('img');
    const src = typeof value === 'string' ? value : value?.url;
    if (!src) throw new Error('ResizableImage: src not provided');

    img.setAttribute('src', src);

    // 🔑 Always 100% inside wrapper (wrapper controls the final size)
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.display = 'block';
    img.style.pointerEvents = 'none';

    wrapper.appendChild(img);

    // Store natural image size for info
    img.onload = () => {
      if (!value?.width) wrapper.style.width = img.naturalWidth + 'px';
      if (!value?.height) wrapper.style.height = img.naturalHeight + 'px';

      wrapper.setAttribute('data-original-width', img.naturalWidth.toString());
      wrapper.setAttribute('data-original-height', img.naturalHeight.toString());
    };

    return wrapper;
  }

  static value(node: HTMLDivElement) {
    const img = node.querySelector('img') as HTMLImageElement | null;
    return {
      url: img ? img.getAttribute('src') : '',
      // ✅ Save wrapper’s actual dimensions
      width: node.style.width ? parseInt(node.style.width, 10) : undefined,
      height: node.style.height ? parseInt(node.style.height, 10) : undefined,
    };
  }
}



Quill.register(ResizableImage);
