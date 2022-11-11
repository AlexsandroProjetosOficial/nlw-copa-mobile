import { useEffect, useState } from 'react';
import { Box, FlatList, useToast } from 'native-base';
import { api } from '../service/api';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
	poolId: string;
	code: string;
}

export function Guesses({ poolId, code }: Props) {
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingGuessConfirm, setIsLoadingGuessConfirm] = useState(false);
	const [firstTeamPoints, setFirstTeamPoints] = useState('');
	const [secondTeamPoints, setSirstTeamPoints] = useState('');
	const [games, setGames] = useState<Array<GameProps>>([]);

	const toast = useToast();

	const getGames = async () => {
		try {
			setIsLoading(oldState => !oldState);

			const { games } = await (await api.get(`/polls/${poolId}/games`)).data;

			setGames(games);
		} catch (error) {
			toast.show({
				title: 'Não foi possível encontrar o jogo.',
				placement: 'top',
				bgColor: 'red.500'
			});
		} finally {
			setIsLoading(oldState => !oldState);
		}
	}

	const handleGuessConfirm = async (gameId: string) => {
		try {
			if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
				return toast.show({
					title: 'Informe o placar do palpite.',
					placement: 'top',
					bgColor: 'red.500'
				});
			}

			setIsLoadingGuessConfirm(oldState => !oldState);

			await api.post(`/polls/${poolId}/games/${gameId}/guesses`, {
				firstTeamPoints: Number(firstTeamPoints),
				secondTeamPoints: Number(secondTeamPoints)
			});

			toast.show({
				title: 'Palpite realizado com sucesso.',
				placement: 'top',
				bgColor: 'green.500'
			});

			setIsLoadingGuessConfirm(oldState => !oldState);

			getGames();
		} catch (error) {
			console.log(error);
			toast.show({
				title: 'Não foi possível enviar o palpite.',
				placement: 'top',
				bgColor: 'red.500'
			});
		}
	}

	useEffect(() => {
		getGames();
	}, [poolId]);

	if(isLoading) return <Loading />

	return (
		<FlatList
			data={games}
			keyExtractor={item => item.id}
			renderItem={({ item }) => (
				<Game
					data={item}
					setFirstTeamPoints={setFirstTeamPoints}
					setSecondTeamPoints={setSirstTeamPoints}
					onGuessConfirm={() => handleGuessConfirm(item.id)}
				/>
			)}
			_contentContainerStyle={{ pb: 10 }}
			ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
		/>
	);
}
