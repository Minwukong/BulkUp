import fs from 'fs';
import path from 'path';

// 폴더 경로를 받아 없는 폴더들을 생성해주는 함수
export function mkDir(dir: string) {
    let pathList: string[] = [];
    createFolderRoutine(dir, pathList);
}
// 폴더 경로 생성 재귀 루틴
function createFolderRoutine(dir: string, pathList: string[]) {
    if (!fs.existsSync(dir)) {
        pathList.push(dir);
        createFolderRoutine(path.join(dir, '..'), pathList);
    } else {
        // console.log('dir :', dir, 'pathList :', pathList);
        for (let i = pathList.length - 1; i >= 0; i--) {
            const path = pathList[i];
            if (!fs.existsSync(path)) fs.mkdirSync(path);
        }
    }
}

// 파일 저장
export function saveFile(file: any, dir: string) {
    return new Promise((resolve, reject) => {
        const read = fs.createReadStream(file.path);
        const write = fs.createWriteStream(dir + '/' + file.name);
        read.pipe(write);
        write.on('finish', () => {
            resolve(path);
        });
        write.on('error', (err) => {
            reject(err);
        });
    });
}
