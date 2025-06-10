import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api/axios';
import ScreenContainer from '../utils/ScreenContainer';

export default function Register() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { username, password });
      setMessage('Cadastro realizado com sucesso!');
      setTimeout(() => navigation.navigate('Login'), 500);
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao cadastrar';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro</Text>
        {message && (
          <Text style={{ color: message.includes('sucesso') ? 'green' : 'red', textAlign: 'center' }}>
            {message}
          </Text>
        )}
        <TextInput
          placeholder="Usuário"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <Button
          title={loading ? 'Cadastrando...' : 'Cadastrar'}
          onPress={handleRegister}
          disabled={loading}
          color="#2a9d8f"
        />
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Já tem uma conta? <Text style={{ fontWeight: 'bold', color: '#0077cc' }}>Entrar</Text>
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, borderColor: '#ccc' },
  link: { marginTop: 10, textAlign: 'center' },
});
