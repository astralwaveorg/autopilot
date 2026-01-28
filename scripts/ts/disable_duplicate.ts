/*
 * @Author: Astral
 * @Date: 2025-01-28
 * @Description: 
 * @cron: 20 20 * * *
 * @new Env('')
 * @: IPPORT  http://localhost:5700
 * @: QL_TOKEN  Token
 * @: QL_OPENAPI OpenAPI clientId&clientSecret
 */

import { Env } from '../../utils';
import { QLAPI } from '../../utils/ql';

const $ = new Env('禁用重复脚本', { sep: ['@', '\n', '&'] });

interface TaskItem {
  id: number;
  _id: string;
  name: string;
  command: string;
  schedule: string;
  isDisabled: number;
  last_execution_time: number;
}

class DisableDuplicateTask {
  private ql: QLAPI;

  constructor() {
    const host = process.env.IPPORT || 'http://localhost:5700';
    this.ql = new QLAPI(host);
  }

  async start() {
    try {
      $.log(` ...`, 'info');

      const taskList = await this.ql.getTasks();

      if (!taskList || taskList.length === 0) {
        $.log(`  `, 'warn');
        return;
      }

      $.log(` ${taskList.length}`, 'info');

      const taskMap = new Map<string, TaskItem[]>();
      const disabledList = taskList.filter((task: TaskItem) => task.isDisabled === 1);

      $.log(` ${disabledList.length}${taskList.length - disabledList.length}`, 'info');

      // 
      for (const item of taskList) {
        if (!item.command) continue;
        if (!taskMap.has(item.name)) {
          taskMap.set(item.name, []);
        }
        taskMap.get(item.name)!.push(item);
      }

      // 
      const duplicateTasks: TaskItem[] = [];
      const message: string[] = [];

      for (const [name, tasks] of taskMap.entries()) {
        if (tasks.length > 1) {
          const enabledList = tasks.filter((task: TaskItem) => task.isDisabled === 0);

          if (enabledList.length > 1) {
            //  lzwme 
            const sorted = enabledList.sort((a, b) => {
              if (a.command.includes('lzwme')) return -1;
              if (b.command.includes('lzwme')) return 1;
              return (b.last_execution_time || 0) - (a.last_execution_time || 0);
            });

            message.push(`\n${name}`);
            sorted.forEach((task, index) => {
              const status = index === 0 ? '' : '';
              message.push(`${status} [${task.name}] ${task.command.replace('task ', '')}`);
            });

            // 
            duplicateTasks.push(...sorted.slice(1));
          }
        }
      }

      if (duplicateTasks.length > 0) {
        $.log(`  ${duplicateTasks.length} `, 'info');
        const ids = duplicateTasks.map((task: TaskItem) => task._id || task.id);
        await this.ql.disableTask(ids);
        $.log(`  ${duplicateTasks.length} `, 'info');
        $.msgs.push(message.join('\n'));
      } else {
        $.log(` `, 'info');
        $.msgs.push(' ');
      }
    } catch (error) {
      $.log(` : ${(error as Error).message}`, 'error');
      $.msgs.push(` : ${(error as Error).message}`);
    }
  }
}

$.init(DisableDuplicateTask, 'DUMMY')
  .catch(error => {
    $.log(` : ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });
