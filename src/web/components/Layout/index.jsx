import React from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'

import Header from './Header'
import Sidebar from './Sidebar'
import SidebarFooter from './SidebarFooter'

import LicenseComponent from '~/components/License'
import AboutComponent from '~/components/About'
import GuidedTour from '~/components/Tour'

import actions from '~/actions'
import getters from '~/stores/getters'
import { connect } from 'nuclear-js-react-addons'

import style from './style.scss'

@connect(props => ({ UI: getters.UI }))
class Layout extends React.Component {

  static contextTypes = {
    reactor: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <div className={classnames('wrapper', 'bp-wrapper')}>
        <Sidebar>
          <Header />
          <section className={classnames(style.container, 'bp-container')}>{this.props.children}</section>
        </Sidebar>
        <SidebarFooter />
        <GuidedTour opened={window.SHOW_GUIDED_TOUR}/>
        <LicenseComponent opened={this.props.UI.get('licenseModalOpened')} />
        <AboutComponent opened={this.props.UI.get('aboutModalOpened')} />
      </div>
    )
  }
}

export default Layout
