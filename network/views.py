import json 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post 

@csrf_exempt 
@login_required
def compose(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    data = json.loads(request.body)

    if data["text"]:
        post = Post(
            author=request.user,
            text=data["text"]
        )

        post.save()

        return JsonResponse({"message": "Post successfully saved"}, status=201)
    
    return JsonResponse({"error": "POST can not be empty"}, status=400)

@csrf_exempt
def posts(request, view, id, page_nr):
    if view == "allposts":
        posts = Post.objects.all().order_by("-date")
    
    elif view == "profile":
        user = User.objects.get(pk=id)
        posts = Post.objects.filter(author=user).order_by("-date")

    elif view == "following" and request.user.username:
        posts = Post.objects.filter(author__in=request.user.following.all()).order_by("-date")

    p = Paginator(posts, 10)
    current_posts = p.page(page_nr)
    
    return JsonResponse({
        "user": request.user.to_json(request.user) if request.user.username else None ,
        "profileUser": user.to_json(request.user) if view == "profile" else None,
        "posts": [post.to_json(request.user) for post in current_posts.object_list],
        "num": p.num_pages,
        "current": page_nr,
        "prev": current_posts.has_previous(),
        "next": current_posts.has_next()
    })


def follow(request, id):
    user = User.objects.get(pk=id)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not login"}, status=400)
    if request.user in user.followers.all():
        user.followers.remove(request.user)
    else:
        user.followers.add(request.user)
    return JsonResponse({"follow": True})


def like(request, id):
    post = Post.objects.get(pk=id)
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not login"}, status=400)
    
    if request.user in post.like.all():
        post.like.remove(request.user)
    else:
        post.like.add(request.user)

    return JsonResponse({"like": True})

@csrf_exempt
def edit(request, id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required"}, status=400)
    
    if not request.user.username:
        return JsonResponse({"error": "User must login"}, status=400)
    
    try:
        post = Post.objects.get(pk=id)

        if post.author != request.user:
            return JsonResponse({"error": "Not allowed to edit post"}, status=401)
        
        data = json.loads(request.body)

        if data["text"]:
            post.text = data["text"]
            post.save()

            return JsonResponse({"message": "Post successfully saved"}, status=201)
    
        return JsonResponse({"error": "PUT can not be empty"}, status=400)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)
    

def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
