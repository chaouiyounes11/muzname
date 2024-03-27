'use client';

import { useFavoriteNamesContext } from '@/app/store/favorite-names-context';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import {green} from '@mui/material/colors';
import {ArrowLeftIcon} from '@heroicons/react/16/solid';
import Link from 'next/link';

const getStory = async (name: string) => {
    try {
        const response = await axios.post(`${process.env.URL ?? ''}/api/get-story`, { name });
        return response.data.story;
    } catch (error) {
        console.error('Error fetching fractionne runs:', error);
        throw error;
    }
};

const FavoritePage = () => {
    const { favoriteNames, addStory } = useFavoriteNamesContext();
    const [loadingStates, setLoadingStates] = useState(Array(favoriteNames.length).fill(false));
    const [isDisabled, setIsDisabled] = useState(false);

    const getRuns = async (name: string, index: number) => {
        const updatedLoadingStates = [...loadingStates];
        updatedLoadingStates[index] = true;
        setLoadingStates(updatedLoadingStates);

        try {
            const res = await getStory(name);
            addStory(name, res);
        } catch (e) {
            console.log(e);
        } finally {
            updatedLoadingStates[index] = false;
            setLoadingStates(updatedLoadingStates);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-3">
            <header className='fixed shadow-[0px_0px_5px_5px_#1a202c] z-50 bg-white px-8 py-4 top-0 min-h-4 flex items-center justify-between w-full'>
                <Link href='/' className='absolute left-2 flex justify-center items-center text-nowrap'>
                    <ArrowLeftIcon className="w-6 h-6 cursor-pointer dark:text-white" />
                    <span>Retour</span>
                </Link>
                <h1 className="text-4xl font-extrabold w-full text-center dark:text-white">Mes favoris</h1>
            </header>
            <ul className="max-w-md mt-20 w-full space-y-1 text-gray-500 list-inside dark:text-gray-400">
                {favoriteNames.map((name, i) => (
                    <li key={i} className="flex flex-col w-10/12 !my-5 border-b-2 cursor-pointer pb-2 border-teal-500 text-lg !mx-auto justify-between items-center">
                        <div className="w-full mb-6 flex justify-between">
                            {name.name}
                            {!favoriteNames.find((f) => f.name === name.name)?.story && (
                                <LoadingButton
                                    sx={{
                                        bgColor: green[800],
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                    }}
                                    loading={loadingStates[i]}
                                    disabled={isDisabled}
                                    onClick={() => getRuns(name.name, i)}
                                    variant="contained"
                                >
                                    <span>connaitre l&apos;histoire</span>
                                </LoadingButton>
                            )}
                        </div>
                        {favoriteNames.find((f) => f.name === name.name)?.story && (
                            <p>{favoriteNames.find((f) => f.name === name.name)?.story}</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FavoritePage;
