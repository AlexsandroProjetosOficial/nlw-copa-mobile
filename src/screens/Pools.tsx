import { useState, useCallback } from 'react';
import { VStack, Icon, useToast, FlatList } from "native-base";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Octicons } from '@expo/vector-icons'
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { api } from "../service/api";
import { Loading } from '../components/Loading';
import { PoolCard, PoolCardProps } from '../components/PoolCard';
import { EmptyPoolList } from '../components/EmptyPoolList';

export function Pools() {
	const [isLoading, setIsLoading] = useState(false);
	const [polls, setPolls] = useState<Array<PoolCardProps>>([]);

	const toast = useToast();

	const { navigate } = useNavigation();

	const getPolls = async () => {
		try {
			setIsLoading(oldState => !oldState);

			const { polls } = (await api.get('/polls')).data;

			setPolls(polls);
		} catch (error) {
			toast.show({
				title: 'Não foi possível carregar os bolões',
				placement: 'top',
				bgColor: 'red.500'
			})
		} finally {
			setIsLoading(oldState => !oldState);
		}
	}

	useFocusEffect(useCallback(() => {
		getPolls();
	}, []));

	return (
		<VStack flex={1} bgColor='gray.900'>
			<Header title="Meus bolões" />

			<VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor='gray.500' pb={4} mb={4}>
				<Button
					title="BUSCAR BOLÃO POR CÓDIGO"
					leftIcon={<Icon as={Octicons} name='search' color='black' size='md' />}
					onPress={() => navigate('find')}
				/>
			</VStack>

			{
				isLoading
					? <Loading />
					: <FlatList
						data={polls}
						keyExtractor={item => item.id}
						renderItem={({ item }) => (
							<PoolCard
								data={item}
								onPress={() => navigate('details', { id: item.id })}
							/>
						)}
						showsVerticalScrollIndicator={false}
						_contentContainerStyle={{ pb: 10 }}
						ListEmptyComponent={() => <EmptyPoolList />}
						px={5}
					/>
			}
		</VStack>
	)
}