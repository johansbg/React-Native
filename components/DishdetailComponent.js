import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Button, Modal } from 'react-native';
import { Card, Icon  } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import { Rating, AirbnbRating } from 'react-native-elements';
import { Input } from 'react-native-elements';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (id, dishId, rating, author, comment) => dispatch(postComment(id, dishId, rating, author, comment))
})

function RenderDish(props) {
    const dish = props.dish;
    
    if (dish != null){
        
        return(
            <Card
            featuredTitle={dish.name}
            image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <Text style={styles.container}>
                <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                <Icon
                    raised
                    reverse
                    name={'pencil'}
                    type='font-awesome'
                    color='#512DA8'
                    onClick={() => {props.onClick(true);}}
                    />
                </Text>
            </Card>
        );

    }
    else{
        return(
            <View></View>
        );
    }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
                <Text>
                    <Rating
                    imageSize={15}
                    readonly
                    startingValue={item.rating}
                    />
                </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DishDetail extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            dishes: DISHES,
            comments: COMMENTS,
            favorites: [],
            showModal: false,
            Rating: 3, 
            Author: '', 
            Comment: ''
        };
    }

    static navigationOptions = {
        title: 'Dishdetail'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        console.log(JSON.stringify(this.state.showModal));
        this.setState({showModal: !this.state.showModal});
    }

    handleComment() {
        console.log(JSON.stringify(this.state.Author));
        console.log(JSON.stringify(this.state.Comment));
        console.log(JSON.stringify(this.state.Rating));
        const dishId=this.props.navigation.getParam('dishId', '');
        const id= this.state.comments.length;
        this.props.postComment(id,dishId,this.state.Rating,this.state.Author,this.state.Comment);
        this.toggleModal();
    }
    resetForm() {
        this.setState({
            Rating: 3, 
            Author: '', 
            Comment: ''
        });
    }

    render(){
        
        const dishId = this.props.navigation.getParam('dishId', '');

        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onClick= {() => this.toggleModal()}
                    />
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                        <Text style = {styles.modalTitle}>Your Reservation</Text>
                        <Rating
                        showRating
                        startingValue={this.state.Rating}
                        onFinishRating={(rating) => this.setState({Rating: rating})}
                        style={{ paddingVertical: 10 }}
                        />
                        <Input
                            placeholder='Author'
                            defaultValue={this.state.author}
                            onChangeText={(value) => this.setState({Author: value})}
                            leftIcon={
                                <Icon
                                name={'user'}
                                type='font-awesome'
                                size={24}
                                color='black'
                                />
                            }
                        />
                        <Input
                            placeholder='Comment'
                            defaultValue={this.state.comment}
                            onChangeText={(value) => this.setState({Comment: value})}
                            leftIcon={
                                <Icon
                                name={'comment'}
                                type='font-awesome'
                                size={24}
                                color='black'
                                />
                            }
                        />
                        <Button style = {styles.Button}
                            onPress = {() =>{this.handleComment(); this.resetForm();}}
                            color="#512DA8"
                            title="submit" 
                            />
                        <Button style = {styles.Button}
                            onPress = {() =>{this.toggleModal(); this.resetForm();}}
                            color="#9c9c9c"
                            title="Cancel" 
                        />
                    </View>
                </Modal>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
    
}
var styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center', // <-- the magic
    },
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
      },
      formLabel: {
          fontSize: 18,
          flex: 2
      },
      formItem: {
          flex: 1
      },
      modal: {
          justifyContent: 'center',
          margin: 20
       },
       modalTitle: {
           fontSize: 24,
           fontWeight: 'bold',
           backgroundColor: '#512DA8',
           textAlign: 'center',
           color: 'white',
           marginBottom: 20
       },
       modalText: {
           fontSize: 18,
           margin: 10
       },
       Button: {
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);