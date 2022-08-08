import { paste } from 'copy-paste';

export async function copyPaste(): Promise<string> {
  return new Promise((res, rej) => {
    return paste((error, content) => {
      if (content) {
        return res(content);
      } else {
        return rej(new Error('Please copy an URL'));
      }
    });
  });
}
