// implement your posts router here
const Post = require("./posts-model");
const router = require("express").Router();

// geting post information
router.get("/", (req, res) => {
    Post.find()
        .then(posts => res.json(posts))
        .catch(() => res.status(500).json({
            message: "The posts information could not be retrieved"
        }))

}); 

// gettig post by ID

router.get("/:id", (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then(post => {
            if(!post){
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
                
            } else {
                res.json(post)
            }
        })
        .catch(() => res.status(500).json({
            message: "The post information could not be retrieved"
        }))
});

// creating a new post 

router.post("/", (req, res) => {
    const body = req.body;
    if(!body.title || !body.cotents){
        res.status(400).json({
            message: "Please provide a title and contents for the post"
        })
    } else {
        Post.insert(body)
        .then(({id}) => {
            return Post.findById(id)
        })
        .then(post => res.status(201).json(post))
        .catch(() => res.status(500).json({
            message: "There was an error while saving the post to the data base"
        }))
    }
}); 

// making changes to posts

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    if(!body.title || !body.contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.update(id, body)
            .then((post) => {
                if(!post){
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else {
                    return Post.findById(id)
                }
            })
            .then(post => res.json(post))
            .catch(() => res.status(500).json({
                message: "The post information could not be modified"
            }))
    }
});

// deleteing a post 

reouter.delete("/:id", (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then(post => {
            if(!post){
                res.status(404).json({
                    message: "The post with that ID does not exist"
                })
            } else {
                res.json(post)
                return Post.remove(id)
            }
        })
        .catch(() => res.status(500).json({
            message: "The post could not be removed"
        }))
});

// get comments 
router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then(post => {
            if(!post){
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                return Post.findPostComments(id)
            }
        })
        .then(post => res.json(post))
        .catch(() => res.status(500).json({
            message: "The comments information could not be retrieved"
        }))
});

module.exports = router; 