import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RepositoryItem = ({ item }) => (
  <View style={styles.item}>
    <Text>{item.fullName}</Text>
    <Text>{item.description}</Text>
    <Text>{item.language}</Text>
    <Text>Forks: {item.forksCount}</Text>
    <Text>Stars: {item.stargazersCount}</Text>
    <Text>Rating: {item.ratingAverage}</Text>
    <Text>Reviews: {item.reviewCount}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    padding: 10,
  },
});

export default RepositoryItem;
