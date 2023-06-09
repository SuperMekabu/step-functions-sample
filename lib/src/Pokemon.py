class Pokemon:
    __name: str
    __height: float
    __weight: float

    def __init__(self, name: str, height: float, weight: float):
        self.__name = name
        self.__height = height
        self.__weight = weight

    def get_name(self) -> str:
        return self.__name

    def get_height(self) -> float:
        return self.__height

    def get_weight(self) -> float:
        return self.__weight
