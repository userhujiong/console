/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import { Column, Columns, Form, Input, TextArea } from '@kube-design/components'

import { PATTERN_NAME } from 'utils/constants'

import { set } from 'lodash'
import CodeRepoSelector from '../../../CodeRepoSelector'
import { TypeSelect } from '../../../Base'

export default class BaseInfo extends React.Component {
  state = {
    type: 0,
  }

  validator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkPipelineName({
        name: value,
        cluster: this.props.cluster,
        devops: this.props.devops,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({
            field: rule.field,
            message: t('NAME_EXIST_DESC'),
          })
        }
        callback()
      })
  }

  render() {
    const {
      formRef,
      formTemplate,
      devops,
      cluster,
      showCodeRepoCreate,
      codeRepoSelectorRef,
    } = this.props

    return (
      <Form ref={formRef} data={formTemplate}>
        <Columns>
          <Column>
            <Form.Item
              label={t('NAME')}
              desc={t('NAME_DESC')}
              rules={[
                { required: true, message: t('NAME_EMPTY_DESC') },
                {
                  pattern: PATTERN_NAME,
                  message: t('INVALID_NAME_DESC'),
                },
                { validator: this.validator },
              ]}
            >
              <Input name="name" maxLength={63} />
            </Form.Item>
            <Form.Item label={t('DESCRIPTION')} desc={t('DESCRIPTION_DESC')}>
              <TextArea name="description" maxLength={256} />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label={t('DEVOPS_PROJECT')}
              desc={t('PIPELINE_CREATE_DEVOPS_PROJECT_DESC')}
            >
              <Input name="devopsName" disabled />
            </Form.Item>
          </Column>
        </Columns>
        <TypeSelect
          value={this.state.type}
          onChange={type => {
            this.setState({ type })
            set(formTemplate, 'MULTI_BRANCH_PIPELINE', undefined)
          }}
          name="pipeline-type"
          options={[
            {
              label: t('PIPELINE_PL'),
              value: 0,
              icon: 'branch',
              description: t('BRANCH_PIPELINE_DESC'),
            },
            {
              label: t('MULTI_BRANCH_PIPELINE'),
              value: 1,
              icon: 'branch',
              description: t('MULTI_BRANCH_PIPELINE_DESC'),
            },
          ]}
        />
        {this.state.type === 1 && (
          <Form.Item
            label={t('CODE_REPOSITORY_OPTIONAL')}
            rules={[
              {
                required: true,
                message: t('CODE_REPOSITORY_REQUIRED_DESC'),
              },
            ]}
          >
            <CodeRepoSelector
              name="multi_branch_pipeline"
              devops={devops}
              cluster={cluster}
              isComplexMode={true}
              ref={codeRepoSelectorRef}
              showCreateRepo={showCodeRepoCreate}
            />
          </Form.Item>
        )}
      </Form>
    )
  }
}
