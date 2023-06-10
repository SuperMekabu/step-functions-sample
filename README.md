# Step functionsの練習

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
- extract_{1,2,3}.py
  - S3から情報を取り出して、それぞれ担当のチャンクからランダムにポケモンを選んで情報を取得
  - その情報をPayloadに出力
  - ここはParallelなので、3つのLambdaが並列に実行される
- aggregator.py
  - 3つのLambdaの結果を集約して、それぞれの情報を処理して出力