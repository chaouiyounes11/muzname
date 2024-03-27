import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useState
} from 'react';

interface FavoriteNamesContextType {
    favoriteNames: { name: string, isFavorite: boolean, story?: string }[];
    totalFavoriteNames: number;
    addFavoriteName: (favoriteName: string) => void;
    addStory: (favoriteName: string, story: string) => void;
    removeFavoriteName: (favoriteNameId: string) => void;
    itemIsFavorite: (favoriteNameId: string) => boolean;
}

const FavoriteNamesContext = createContext<FavoriteNamesContextType>({
    favoriteNames: [],
    totalFavoriteNames: 0,
    addFavoriteName: (favoriteName: string) => {},
    addStory: (favoriteName: string, story: string) => {},
    removeFavoriteName: (favoriteNameId: string) => {},
    itemIsFavorite: (favoriteNameId: string) => false
});

const FavoriteNamesContextProvider = (props: PropsWithChildren<{}>) => {
    const [favoriteNames, setFavoriteNames] = useState<{ name: string, isFavorite: boolean }[]>([]);

    const addFavoriteName = (favoriteName: string) => {
        if (favoriteNames.some(name => name.name === favoriteName)) return;

        setFavoriteNames(prevNames => [...prevNames, { name: favoriteName, isFavorite: true }]);
    };

    const removeFavoriteName = (favoriteName: string) => {
        setFavoriteNames(prevNames =>
            prevNames.filter(name => name.name !== favoriteName)
        );
    };

    const addStory = (favoriteName: string, story: string) => {
        setFavoriteNames(prevNames => {
            const favoriteNameIndex = prevNames.findIndex(name => name.name === favoriteName);
            const updatedFavoriteName = { ...prevNames[favoriteNameIndex], story };
            const updatedFavoriteNames = [...prevNames];
            updatedFavoriteNames[favoriteNameIndex] = updatedFavoriteName;
            return updatedFavoriteNames;
        });
    };

    const itemIsFavorite = (favoriteNameId: string): boolean => {
        return favoriteNames.some(name => name.name === favoriteNameId && name.isFavorite);
    };

    const contextValue: FavoriteNamesContextType = {
        favoriteNames,
        totalFavoriteNames: favoriteNames.length,
        addFavoriteName,
        addStory,
        removeFavoriteName,
        itemIsFavorite
    };

    return (
        <FavoriteNamesContext.Provider value={contextValue}>
            {props.children}
        </FavoriteNamesContext.Provider>
    );
};

const useFavoriteNamesContext = () => {
    return useContext(FavoriteNamesContext);
};

export { FavoriteNamesContext, FavoriteNamesContextProvider, useFavoriteNamesContext };
