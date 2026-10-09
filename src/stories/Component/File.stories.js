import { createFile } from './File';

export default {
  title: 'Theme Builder/Components/File',
  tags: ['autodocs'],
};

const Template = (args) => {
  return createFile(args);
};

export const Default = Template.bind({});
Default.args = {
  id: 'file-upload',
  labelText: 'Click to upload your file',
  helperText: 'Supported formats: SVG, PNG, JPG, GIF (MAX. 800x400px)',
};