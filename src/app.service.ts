import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './taks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll() {
    return await this.taskRepository.find();
  }

  async getByID(id: number) {
    return await this.taskRepository.findOneBy({ id });
  }

  async createTask(name: string) {
    const task = await this.taskRepository.create({ name });

    await this.taskRepository.save(task);
    return await this.getAll();
  }

  async doneTask(id: number) {
    const task = await this.getByID(id);
    if (!task) return null;
    task.isCompleted = !task.isCompleted;
    return await this.taskRepository.save(task);
  }

  async editTask(id: number, name: string) {
    const task = await this.getByID(id);
    if (!task) return null;
    task.name = name;
    await this.taskRepository.save(task);
    return await this.getAll();
  }

  async deleteTask(id: number) {
    const task = await this.getByID(id);
    if (!task) return null;
    await this.taskRepository.delete({ id });
    return await this.getAll();
  }
}
