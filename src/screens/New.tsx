import { Heading, Text, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../service/api";
import Logo from '../assets/logo.svg';

export function New() {
	const [title, setTitle] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const toast = useToast();

	const handlePollCreate = async () => {
		if (!title.trim()) {
			return toast.show({
				title: 'Informe um nome para o seu bolão.',
				placement: 'top',
				bgColor: 'red.500'
			});
		}

		setIsLoading(oldState => !oldState);

		try {
			const { code } = await (await api.post('/polls', { title })).data;

			if (!code) {
				toast.show({
					title: 'Não foi possível criar o bolão.',
					placement: 'top',
					bgColor: 'red.500'
				});
			}

			toast.show({
				title: 'Bolão criado com sucesso.',
				placement: 'top',
				bgColor: 'green.500'
			});

			setTitle('');
		} catch (error) {
			toast.show({
				title: 'Não foi possível criar o bolão.',
				placement: 'top',
				bgColor: 'red.500'
			});
		} finally {
			setIsLoading(oldState => !oldState);
		}
	}


	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Criar novo bolão" />

			<VStack mt={8} mx={5} alignItems='center'>
				<Logo />

				<Heading fontFamily='heading' color='white' fontSize='xl' my={8} textAlign='center' >
					Crie seu próprio bolão da copa {'\n'} e compartilhe entre amigos!
				</Heading>

				<Input placeholder="Qual o nome do seu bolão" mb={2} onChangeText={setTitle} value={title} />

				<Button title="CRIAR MEU BOLÃO" onPress={handlePollCreate} isLoading={isLoading} />

				<Text color='gray.200' fontSize='sm' textAlign='center' px={8} mt={4}>
					Após criar seu bolão, você receberá um {'\n'} código único que poderá usar para convidar {'\n'} outras pessoas.
				</Text>
			</VStack>
		</VStack>
	)
}