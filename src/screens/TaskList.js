import React, {Component} from 'react'
import {
    View, 
    Alert, 
    Text, 
    ImageBackground, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    Platform
} from 'react-native'
import todayImage from '../../assets/imgs/today.jpg'
import moment from 'moment'
import 'moment/locale/pt-br'
import commomStyles from '../commomStyles'
import Task from '../components/Task'
import AddTask from '../screens/AddTask'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class TaskList extends Component {

    state = {
        showDoneTasks: true,
        showAddTask: false,
        visibleTasks: [],
        tasks: [{
            id: Math.random(),
            desc: 'Comprar Livro',
            estimateAt: new Date(),
            doneAt: new Date(),
        },
        {
            id: Math.random(),
            desc: 'Comprar Livro 2',
            estimateAt: new Date(),
            doneAt: null,
        }]
    }

    componentDidMount = () => {
        this.filterTasks()
    }

    toggleFilter = () => {

        this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)
    }

    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task => {
            if(task.id == taskId){
                task.doneAt = task.doneAt ? null : new Date()
            }
        })
    
        this.setState({tasks}, this.filterTasks)
    }
    
    filterTasks = () => {
        let visibleTasks = null

        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks]
        }else{

            const pending = task => task.doneAt === null

            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({visibleTasks})
    }

    addTask = newTask => {

        console.log("olha a task", newTask)
        if(!newTask.desc || !newTask.desc.trim()){

            Alert.alert('Dados Inválidos', 'Descrição não informada!')

            return
        }

        const tasks = [...this.state.tasks]

        tasks.push({
            id: Math.random,
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })

        this.setState({tasks, showAddTask: false}, this.filterTasks)

    }
    
    render(){

        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (
            <View style={styles.container}>
                <AddTask 
                    isVisible={this.state.showAddTask} 
                    onCancel={() => this.setState({showAddTask:false})}
                    onSave={this.addTask}    
                />
                <ImageBackground style={styles.background} source={todayImage}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={ this.state.showDoneTasks ? 'eye' : 'eye-slash'} size={20} color={commomStyles.colors.secondary}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subTitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList
                        data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Task {...item} toggleTask={this.toggleTask}/>}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => this.setState({showAddTask: true})}
                    activeOpacity={0.7}    
                >
                    <Icon name='plus' size={20} color={commomStyles.colors.secondary}/>
                </TouchableOpacity>
            </View>
        )
    }

}


const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commomStyles.fontFamily,
        fontSize: 50,
        color: commomStyles.colors.secondary,
        marginLeft: 20,
        marginBottom: 20
    },
    subTitle: {
        fontFamily: commomStyles.fontFamily,
        color: commomStyles.colors.secondary,
        fontSize: 20, 
        marginBottom: 20,
        marginLeft: 20
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: Platform.OS == 'ios' ? 40 : 20
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height:50,
        borderRadius: 25,
        backgroundColor: commomStyles.colors.today,
        justifyContent: "center",
        alignItems: 'center'
    }
})