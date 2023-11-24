import random
from locust import HttpUser, TaskSet, between

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
    l.client.post("/entry", {'place': random.choice(places)})

def get(l):
    l.client.get("/entries")

def delete(l):
    l.client.get("/clear")

class UserBehavior(TaskSet):

    def on_start(self):
        insert(self)

    tasks = {insert: 3,
        get: 2,
        delete: 1,}

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 10)