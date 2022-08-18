import { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { VStack, Heading, Icon, useTheme } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

// assets
import Logo from '../assets/logo_primary.svg';
import { Button } from '../components/Button';

// components
import { Input } from '../components/Input';

export function CreateAccount() {

    const { colors } = useTheme();
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    function handleCreateAccount() {
        if (!email || !password) {
            return Alert.alert('Cadastrar', 'Informe e-mail e senha.');
        }

        if (password !== confirm) {
            return Alert.alert('Cadastrar', 'As senhas não conferem.');
        }

        setIsLoading(true);

        auth()
            .createUserWithEmailAndPassword(email, password)
            .catch((error) => {
                console.log(error);
                setIsLoading(false);

                if (error.code === 'auth/invalid-email') {
                    return Alert.alert('Cadastrar', 'E-mail inválido.')
                }

                if (error.code === 'auth/email-already-in-use') {
                    return Alert.alert('Cadastrar', 'E-mail já está em uso.')
                }

                if (error.code === 'auth/weak-password') {
                    return Alert.alert('Cadastrar', 'Senha deve conter 6 caracteres/digitos.')
                }

                return Alert.alert('Entrar', 'Não foi possível se cadastrar.')
            });
    }

    function handleGoBack() {
        navigation.navigate('signin');
    }

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo />

            <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>

            <Input
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
            />

            <Input
                mb={4}
                placeholder="Senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Input
                mb={8}
                placeholder="Confirmar senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setConfirm}
            />

            <Button
                title="Salvar"
                w="full"
                onPress={handleCreateAccount}
                isLoading={isLoading}
            />

            <Button
                title="Voltar"
                variant="outline"
                bg="gray.700"
                borderColor="green.700"
                w="full"
                mt={5}
                onPress={handleGoBack}
                isLoading={isLoading}
            />
        </VStack>
    );
}