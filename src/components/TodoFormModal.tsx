import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Todo, CreateTodoData, UpdateTodoData } from '@/types/todo.types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addNewTodo, updateExistingTodo } from '@/store/todoSlice';
import { useAuth } from '@/store/auth-context';
import StorageService from '@/services/storage.service';

interface TodoFormModalProps {
  visible: boolean;
  onClose: () => void;
  todo?: Todo | null;
}

export default function TodoFormModal({
  visible,
  onClose,
  todo,
}: TodoFormModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority);
      setTags(todo.tags.join(', '));
      const date = todo.dueDate.toDate
        ? todo.dueDate.toDate()
        : todo.dueDate instanceof Date 
        ? todo.dueDate 
        : new Date();
      setDueDate(date.toISOString().split('T')[0]);
      setImageUri(todo.imageUrl || null);
    } else {
      resetForm();
    }
  }, [todo, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(2);
    setTags('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setImageUri(null);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!dueDate) {
      Alert.alert('Error', 'Please select a due date');
      return;
    }

    setLoading(true);
    let finalImageUrl: string | null = null;

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (imageUri && user) {
        try {
          const uploadResult = await StorageService.uploadImage(
            imageUri,
            user.uid,
            StorageService.generateFileName()
          );

          if (uploadResult.success && uploadResult.downloadURL) {
            finalImageUrl = uploadResult.downloadURL;
          } else if (uploadResult.localURL) {
            console.log('Image saved locally:', uploadResult.localURL);
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
        }
      }

      if (todo) {
        const updateData: UpdateTodoData = {
          title: title.trim(),
          priority,
          tags: tagsArray,
          dueDate: new Date(dueDate),
        };
        
        if (description.trim()) {
          updateData.description = description.trim();
        }
        
        if (finalImageUrl) {
          updateData.imageUrl = finalImageUrl;
        }
        
        await dispatch(updateExistingTodo({ id: todo.id, data: updateData }));
      } else {
        if (!user) {
          Alert.alert('Error', 'User not authenticated');
          return;
        }
        
        const createData: CreateTodoData = {
          title: title.trim(),
          priority,
          tags: tagsArray,
          dueDate: new Date(dueDate),
        };
        
        if (description.trim()) {
          createData.description = description.trim();
        }
        
        if (finalImageUrl) {
          createData.imageUrl = finalImageUrl;
        }
        
        await dispatch(addNewTodo({ userId: user.uid, todoData: createData }));
      }
      
      onClose();
    } catch (error: any) {
      console.error('Todo save error:', error);
      Alert.alert('Error', `Failed to save todo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-blue-600 text-lg">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold">
            {todo ? 'Edit Todo' : 'New Todo'}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={loading ? 'opacity-50' : ''}
          >
            <Text className="text-blue-600 text-lg font-semibold">
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Title *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Enter todo title"
              value={title}
              onChangeText={setTitle}
              maxLength={120}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Description</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Enter description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={1024}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Priority</Text>
            <View className="border border-gray-300 rounded-lg">
              <Picker
                selectedValue={priority}
                onValueChange={(value) => setPriority(value)}
              >
                <Picker.Item label="High Priority" value={1} />
                <Picker.Item label="Medium Priority" value={2} />
                <Picker.Item label="Low Priority" value={3} />
              </Picker>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Due Date *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="YYYY-MM-DD"
              value={dueDate}
              onChangeText={setDueDate}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">
              Tags (comma separated)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="work, personal, urgent"
              value={tags}
              onChangeText={setTags}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Image</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-4 items-center"
              onPress={handlePickImage}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} className="w-32 h-32 rounded" />
              ) : (
                <Text className="text-gray-500">Tap to select image</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

