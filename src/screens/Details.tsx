import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { useRoute } from '@react-navigation/native'
import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { api } from '../service/api';
import { Loading } from '../components/Loading';
import { PoolCardProps } from '../components/PoolCard';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { PoolHeader } from '../components/PoolHeader';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

interface RouteParams {
	id: string;
}

export function Details() {
	const [isLoading, setIsLoading] = useState(true);
	const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
	const [pollDetails, setPollDetails] = useState<PoolCardProps>({} as PoolCardProps);

	const route = useRoute();

	const toast = useToast();

	const { id } = route.params as RouteParams;

	const getPollsById = async () => {
		try {
			setIsLoading(true);

			const { poll } = await (await api.get(`/polls/${id}`)).data;

			setPollDetails(poll);
		} catch (error) {
			toast.show({
				title: 'Não foi possível encontrar o bolão',
				placement: 'top',
				bgColor: 'red.500'
			});
		} finally {
			setIsLoading(oldState => !oldState);
		}
	}

	const handleCodeShare = async () => {
		await Share.share({
			message: pollDetails.code
		})
	}

	useEffect(() => {
		getPollsById();
	}, [id]);

	if (isLoading) return <Loading />;

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header
				title={pollDetails.title}
				showBackButton
				showShareButton
				onShare={handleCodeShare}
			/>

			{pollDetails._count?.participants > 0 ? (
				<VStack px={5} flex={1}>
					<PoolHeader
						data={pollDetails}
					/>

					<HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
						<Option title='Seus Palpites' isSelected={optionSelected === 'guesses'} onPress={() => setOptionSelected('guesses')} />
						<Option title='Ranking do grupo' isSelected={optionSelected === 'ranking'} onPress={() => setOptionSelected('ranking')} />
					</HStack>

					<Guesses poolId={pollDetails.id} code={pollDetails.code} />
				</VStack>
			) : (
				<EmptyMyPoolList code={pollDetails.code} />
			)}
		</VStack>
	)
}