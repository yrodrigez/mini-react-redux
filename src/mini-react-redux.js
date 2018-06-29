import React from 'react'
import PropTypes from 'prop-types'
import {createStore} from "redux";


/*
// Tips:

// Get the store's state
store.getState()

// Dispatch changes to the store
// (you won't need to call this but you'll pass it to mapDispatchToProps)
store.dispatch(action)

// subscribe to changes to the store
store.subscribe(() => {})

// unsubscribe from the store
unsubscribe = store.subscribe(() => {})
unsubscribe()
*/

class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      store: props.store,
    }
  }

  getChildContext() {
    return {
      store: this.state.store
    }
  }

  render() {
    return this.props.children;
  }
}

const connect = (mapStateToProps, mapDispatchToProps) => {
  return (Component) => {

    return class extends React.Component {
      static contextTypes = {
        store: PropTypes.object.isRequired,
      };

      componentDidMount(){
        this.unsubscribe = this.context.store.subscribe(()=>{
          this.forceUpdate();
        })
      }

      componentWillUnmount(){
        this.unsubscribe();
      }

      render() {
        const state = this.context.store.getState();
        const dispatch = this.context.store.dispatch;
        return <Component
          {...mapStateToProps(state)}
          {...mapDispatchToProps(dispatch)}
        />
      }
    };
  }
};

export {Provider, connect}
