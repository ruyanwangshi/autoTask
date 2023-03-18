import fs from 'node:fs/promises';
import pdf from 'pdf-lib';
import epubGenerator from 'epub-gen';
import { getFileList, resovePath } from '../../utils/index.js';
async function pdf_epub() {
    const regex = /\.pdf$/i;
    const files = getFileList().filter((file) => regex.test(file));
    const content_array = [];
    console.log('最终结果', files);
    files.forEach(async (file) => {
        content_array.push(fs.readFile(resovePath(file), 'utf-8'));
    });
    let res_value;
    Promise.all(content_array)
        .then((res) => {
        res.forEach((data) => {
            res_value = pdf.PDFDocument.load(data);
        });
    })
        .then(async (res) => {
        // 提取文本数据
        let text = '';
        for (const page of res_value.getPages()) {
            const content = await page.getTextContent();
            text += content.items.map((item) => item.str).join('\n') + '\n';
        }
        // 将文本转换为EPUB，并保存到文件系统中
        const options = {
            title: 'My Book',
            author: 'John Doe',
            output: 'output.epub',
            content: [
                {
                    title: 'Chapter 1',
                    data: text,
                },
            ],
        };
        new epubGenerator(options);
    });
    //   const promptRes = await inquirer.prompt([
    //     {
    //       type: 'checkbox', // 多选框
    //       name: 'build',
    //       choices: builds,
    //     },
    //   ])
}
export default pdf_epub;
