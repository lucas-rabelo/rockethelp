import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { VStack, HStack, useTheme, Text, ScrollView } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard } from 'phosphor-react-native';

import firestore from '@react-native-firebase/firestore';

// components
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetail } from '../components/CardDetail';
import { Input } from '../components/Input';

// DTO
import { OrderFirestoreDTO } from '../DTOs/OrderDTO';

// utils
import { dateFormat } from '../utils/firestoreDateFormat';

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

export function Details() {
    
    const route = useRoute();
    const navigation = useNavigation();
    const { orderId } = route.params as RouteParams;
    const { colors } = useTheme();
    
    const [solution, setSolution] = useState(''); 
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

    function handleOrderClose() {
        if(!solution) {
            return Alert.alert('Solicitação', 'Informe a solução para encerrar a solicitação.');
        }

        firestore()
        .collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .update({
            status: 'closed',
            solution,
            closed_at: firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            Alert.alert('Solicitação', 'Solicitação encerrada.')
            navigation.goBack();
        })
        .catch((error) => {
            console.log(error)
            Alert.alert('Solicitação', 'Não foi possível encerrar sua solicitação.')
        })
    }

    useEffect(() => {
        firestore()
        .collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .get()
        .then((doc) => {
            const { patrimony, description, status, created_at, closed_at } = doc.data();

            const closed = closed_at ? dateFormat(closed_at) : null;

            setOrder({
                id: doc.id,
                patrimony,
                description,
                status,
                solution,
                when: dateFormat(created_at),
                closed
            });

            setIsLoading(false);
        })

    }, []);

    if( isLoading ) {
        return <Loading />;
    }

    return (
        <VStack flex={1} p={6} bg="gray.600">
            <Header title="Solicitação"/>

            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'closed' 
                    ? <CircleWavyCheck size={22} color={colors.green[300]} />
                    : <Hourglass size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    { order.status === 'closed' ? 'finalizado' : 'em andamento' }
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetail 
                    title="equipamento"
                    description={`Patrimônio ${order.patrimony}`}
                    icon={DesktopTower}
                    footer={order.when}
                />
                <CardDetail 
                    title="descrição do problema"
                    description={order.description}
                    icon={Clipboard}
                />
                <CardDetail 
                    title="solução"
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {   
                        order.status === 'open' &&
                        <Input 
                            bg="gray.600}"
                            placeholder="Descrição da solução"
                            onChangeText={setSolution}
                            textAlignVertical="top"
                            multiline
                            h={24}
                        />
                    }
                </CardDetail>

                {
                    order.status === 'open' && 
                    <Button 
                        title="Encerrar solicitação"
                        m={5}
                        isLoading={isLoading}
                        onPress={handleOrderClose}
                    />
                }
            </ScrollView>
        </VStack>
    );
}