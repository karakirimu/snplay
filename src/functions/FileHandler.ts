
export const handleOpenFolder = (props : { onFolderSelect: (files: FileList) => void;}) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        props.onFolderSelect(files);
      }
    };
    input.click();
  };