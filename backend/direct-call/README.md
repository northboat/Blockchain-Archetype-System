## 文件说明

| 文件名                           | 说明                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| Key-Generater-0.0.1-SNAPSHOT.jar | 后端接口包括测试页面的 jar 包，端口默认在 8090               |
| test                             | 魏师兄编译好的 C 程序，用于生成密钥                          |
| *.json                           | 那两个 json 文件是 test 生成的，因为之前想用 json 文件交互，C 程序没改，所有还是生成了，但是没用 |
| Key-Generator                    | 后端源码（包含前端页面）                                     |

注意 jar 运行时要和 test 在同一目录下，因为我在调用的使用直接用 java 调的命令行命令`./test`，写死了

版本说明

- jdk 17
- springboot 3.2.4

## 两个问题

### 公钥省略

public_A/B 的返回结果是省略的，这是 C 运行的结果，如果前端要的是所有的密钥，需要修改魏师兄的 C 程序，并不难

### Test 运行环境问题

> Test 指 C 编译得到的可执行文件，用于生成密钥信息

kali 换源

```sh
sudo vim /etc/apt/sources.list
```

注释掉原来的，添加

```
deb http://mirrors.aliyun.com/kali kali-rolling main non-free contrib
deb-src http://mirrors.aliyun.com/kali kali-rolling main non-free contrib
```

更新

```sh
sudo apt-get update
```

下载 ssl 开发环境

```sh
sudo apt-get install libssl-dev
```

实测中，ubuntu 和 manjaro 下载 libssl-dev 后仍然会报错，前者报错找不到 libcrypto.so.3 依赖，后者报错段错误

但 Kali 安装 libssl-dev 后可以对 lwe-frodo-master2 正常编译并运行
