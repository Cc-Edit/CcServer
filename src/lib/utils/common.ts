import * as fs from 'fs';
import * as path from 'path';

/**
 * 获取文件夹下的所有文件路径
 * @param dirPath: string 路径
 * @param options: string 路径
 * @return string[]
 * */
interface DirOption {
  filter?: {
    format?: string; // 后缀过滤
  };
}
export function getDir(dirPath: string, options?: DirOption): string[] {
  const {
    filter: { format },
  } = options || {};
  const results = [];
  try {
    for (const dirContent of fs.readdirSync(dirPath)) {
      const dirContentPath = path.resolve(dirPath, dirContent);
      if (fs.statSync(dirContentPath).isFile()) {
        if (format) {
          if (dirContent.endsWith(format)) {
            results.push(`${dirPath}/${dirContent}`);
          }
        } else {
          results.push(`${dirPath}/${dirContent}`);
        }
      }
    }
  } catch (error) {}
  return results;
}

/**
 * 生成随机字符串
 * @param len 字符串长度
 * */
export function getRandomString(len = 6): string {
  const str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += str.charAt(Math.floor(Math.random() * str.length));
  }
  return result;
}
