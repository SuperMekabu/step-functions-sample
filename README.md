# Step functionsの練習
## インフラ要素
- step functions
  - parallel
- lambda
  - layers
- s3

## 使い方
- cdk部分は普通に`cdk deploy --all`
- python部分は`cd lib/src`して操作
  - [`lib/src/README.md`](lib/src/README.md)を参照

## 処理の流れ
- get_records.py
  - PokeAPIから得た情報をS3に保存
  - outputPath = `$.Payload`
    - いっぱいoutputされるうちの`Payload`だけを次のstateに送る
- extract_{1,2,3}.py
  - `event`にget_records.pyのreturnがそのまま入ってくる
  - S3から情報を取り出して、それぞれ担当のチャンクからランダムにポケモンを選んで情報を取得
  - その情報をPayloadに出力
  - ここはParallelなので、3つのLambdaが並列に実行される
    - それぞれoutputPath = `$.Payload`しているので、結果は`[1, 2, 3]`のように配列になる
- aggregator.py
  - `event`に`[extract_1のreturn, extract_2のreturn, extract_3のreturn]`と行った感じで各extractの結果が配列で入ってくる
