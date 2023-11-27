import random
from locust import HttpUser, TaskSet, between

headers = {'Content-Type': 'application/json'}

places = [
    'San Francisco',
    'Los Angeles',
    'Rome',
    'Milan',
    'Geneva',
    'Dubai',
    'New York City',
    'Montreal',
    'Tokyo']

def insert(l):
    l.client.post("/entry", json={'place': random.choice(places)}, headers=headers)

def get(l):
    l.client.get("/entries")

def delete(l):
    l.client.get("/clear")

def update(l):
    l.client.put("/update", json={'place': random.choice(places)}, headers=headers)

class UserBehavior(TaskSet):

    def on_start(self):
       insert(self)

    tasks = {insert: 3,
        get: 2,
        delete: 1,
        update: 1}

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(5, 10)