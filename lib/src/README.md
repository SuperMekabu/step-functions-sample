# export dependencies to requirements.txt
`poetry export --format requirements.txt --output requirements.txt`

# install requirements to layer
`pip install -r requirements.txt -t ./layer/`