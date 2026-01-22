// 合并所有profiles_00x.json文件到一个profiles.json文件
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(dataDir, 'profiles.json');

// 读取所有profiles_00x.json文件
const files = [];
for (let i = 1; i <= 9; i++) {
  const fileName = `profiles_00${i}.json`;
  const filePath = path.join(dataDir, fileName);
  if (fs.existsSync(filePath)) {
    files.push(filePath);
  }
}

// 合并所有文件内容
const allProfiles = [];
files.forEach(filePath => {
  console.log(`读取文件: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const profiles = JSON.parse(content);
  allProfiles.push(...profiles);
});

// 写入到profiles.json
console.log(`合并完成，共${allProfiles.length}个征婚信息`);
fs.writeFileSync(outputFile, JSON.stringify(allProfiles, null, 2));
console.log(`已写入到: ${outputFile}`);
