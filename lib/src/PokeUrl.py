class PokeUrl:
    __name: str
    __url: str

    def __init__(self, name: str, url: str):
        self.__name = name
        self.__url = url

    # get __name
    def get_name(self) -> str:
        return self.__name

    # get __url
    def get_url(self) -> str:
        return self.__url
