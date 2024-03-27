'use client';

import axios from 'axios';
import {ChangeEvent, useEffect, useState} from 'react';
import {
    amber,
    green, indigo,
    pink,
    purple, yellow
} from '@mui/material/colors';
import LoadingButton from '@mui/lab/LoadingButton';
import {HeartIcon} from '@heroicons/react/24/outline'
import {HeartIcon as HeartIconSolid} from '@heroicons/react/24/solid'
import {RadioGroupComponent} from '@/app/components/RadioGroup/radio-group';
import {useFavoriteNamesContext} from '@/app/store/favorite-names-context';
import Link from 'next/link';
import {signIn, useSession} from 'next-auth/react';
import prisma from '@/lib/prisma';



type Name = {
    name: string;
    isFavorite: boolean;
};

const getData = async (infos: {gender: string, style: string, length: string}) => {
    try {
        const response = await axios.post(`${process.env.URL ?? ''}/api/get-data`, {infos});
        const stringResponse = response.data.list;
        return stringResponse.split(/\d+\.\s/).slice(1).map((name: string) => name.trim());
    } catch (error) {
        console.error('Error fetching fractionne runs:', error);
        throw error;
    }
};

export default function GetIdeasNames(props: any) {
    const {favoriteNames, addFavoriteName, removeFavoriteName } = useFavoriteNamesContext();
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedLength, setSelectedLength] = useState('');
    const [names, setNames] = useState<Name[]>([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedGender(event.target.value);
    };

    const handleStyleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedStyle(event.target.value);
    };

    const handleLengthChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedLength(event.target.value);
    };

    const handleIsDisabled = () => {
        if (selectedGender && selectedStyle && selectedLength) {
            setIsDisabled(false);
        }
    };

    useEffect(() => {
        handleIsDisabled();
    }, [handleLengthChange, handleIsDisabled]);

    const getRuns = async () => {
        setLoading(true);
        setIsDisabled(true);
        setNames([]);

        try {
            const res = await getData({gender: selectedGender, style: selectedStyle, length: selectedLength});
            const transformedArray = res.map((name: string) => ({
                name: name,
                isFavorite: false
            }));
            setNames(transformedArray);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const toggleFavorite = (index: number, name: string) => {
        setNames(prevNames =>
            prevNames.map((name, i) =>
                i === index ? { ...name, isFavorite: !name.isFavorite } : name
            )
        );
        const isFavorite = favoriteNames.some(favoriteName => favoriteName.name === name);
        if (!isFavorite) {
            addFavoriteName(name)
            props.name = names;
            props.save();
            return;
        }
        removeFavoriteName(name);
        props.name = names;
        props.save();
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-3">
            <header className='fixed shadow-[0px_0px_5px_5px_#1a202c] z-50 bg-white px-8 py-4 top-0 min-h-4 flex items-center justify-between w-full'>
                <h1 className="text-4xl text-teal-500 font-extrabold dark:text-white">Muzname</h1>
                <Link href='/favorite'>
                    <span className='flex justify-center items-center text-nowrap'>Mes favoris <HeartIconSolid className="ml-2 h-6 w-6 text-pink-500" /></span>
                </Link>

                <button onClick={() => signIn()}>connexion</button>

            </header>
            <div className="p-3 mt-5 flex flex-col">
                <h2 className='text-3xl my-10 font-extrabold dark:text-white'>Trouve des idées de prénom de manière innovante, originale et fun</h2>
                <div className='mb-10'>
                    <RadioGroupComponent
                        change={handleChange}
                        colors={{colorGroup1: {color1: pink[300], color2: pink[500]}, colorGroup2: {color1: indigo[600], color2: indigo[800]}}}
                        nameGroup='gender-group'
                        category='Genre'
                        state={selectedGender}
                        choices={{value1: 'fille', value2: 'garçon'}}
                    />
                </div>

                {selectedGender && <div className='mb-10'>
                    <RadioGroupComponent
                        change={handleStyleChange}
                        colors={{colorGroup1: {color1: green[600], color2: green[800]}, colorGroup2: {color1: purple[300], color2: purple[500]}}}
                        nameGroup='style-group'
                        category='Style'
                        state={selectedStyle}
                        choices={{value1: 'traditionnel', value2: 'moderne'}}
                    />
                </div>
                }

                {selectedStyle && <div className='mb-10'>
                    <RadioGroupComponent
                        change={handleLengthChange}
                        colors={{colorGroup1: {color1: yellow[600], color2: yellow[800]}, colorGroup2: {color1: amber[300], color2: amber[500]}}}
                        nameGroup='style-group'
                        category='Longueur'
                        state={selectedLength}
                        choices={{value1: 'court', value2: 'long'}}
                    />
                </div>
                }

                <div  className='md:w-5/12 mx-auto flex justify-center'>

                    <LoadingButton loading={loading} disabled={isDisabled} onClick={getRuns} variant="contained">
                        <span>Je veux des idées</span>
                    </LoadingButton>

                </div>

            </div>
            {names &&
                <ul className="max-w-md w-full space-y-1 text-gray-500 list-inside dark:text-gray-400">{names.map((n, i) =>
                    <li
                        className='flex w-10/12 !my-5 border-b-2 cursor-pointer pb-2 border-teal-500 text-lg !mx-auto justify-between items-center'
                        onClick={() => toggleFavorite(i, n.name)}
                        key={i}>
                        {n.name}
                        {n.isFavorite ? (
                            <HeartIconSolid className="h-6 w-6 text-pink-500" />
                        ) : (
                            <HeartIcon className="h-6 w-6 text-pink-500" />
                        )}
                    </li>)}
                </ul>}
        </main>
    );
}
