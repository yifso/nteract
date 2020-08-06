import { Octokit } from "@octokit/rest";


export const listForks = (owner, repo) => {
   return new Promise(function(resolve, reject) {
    // This gets the fork of the active repo
    const octo = new Octokit()
     octo.repos.listForks({
         owner: owner,
         repo,
      }).then(({data}) => {
         resolve({data})
      }).catch((e) => {
         reject(e)
      })
   });
}

export const createFork = (octo, owner, repo) => {
  return new Promise( (resolve, reject) => {
    octo.repos.createFork({
          owner,
          repo,
        }).then(() => {
            resolve()
        }).catch( (e) => {
            reject(e)
        })
    })
}


export const repoExist = (octo, owner, repo) => {
  return new Promise( (resolve, reject) => {
    octo.repos.get({
          owner,
          repo,
        }).then(() => {
            resolve()
        }).catch( (e) => {
            reject(e)
        })
    })
}

// checkFork performs 3 checks
// A: If user is the owner of repo.
// B: If fork exists.
// C: If fork doesn't exist, create it.
export const checkFork = (
  octo: Octokit,
  org: string,
  repo: string,
  branch: string = `master`,
  username: string
) => {
  return new Promise( (resolve, reject) => {

    // Step 1: Check if user is owner of the repo
    if( username == org ){
      repoExist(octo, username, repo).then( () => {
        resolve()
      }).catch( () => {
        // Repo don't exist
        reject()
      })
    }else{

      // Step 2: Check if user already have a fork of the repo
      listForks(org, repo).then( ({data}) => {
        for (const repo of data){
          if ( repo.owner.login === username){
            resolve()
          }
        };

        // Step 3: Create the fork
        createFork(octo, org, repo).then( () => {
          resolve()
        }).catch( (e) => {
          reject(e)
        })
      }).catch( (e) => {
          reject(e)
      })
    }
  })

}

/*
 *
 * Save commit to github
 *
 */
export const uploadToRepo = async (
    octo: Octokit,
    org: string,
    repo: string,
    branch: string = `master`,
    buffer: {},
    commitMessage: string = `Auto commit from nteract web`,
) => {
    // Step 1: Get current commit
    const currentCommit = await getCurrentCommit(octo, org, repo, branch)

    // Step 2: Get files path and content to create blob
    let pathsForBlobs = []
    let filesContent = []
    for( var key in buffer){
      pathsForBlobs.push(key)
      filesContent.push(buffer[key])
    }

    // Step 3: Create File Blob
    const filesBlobs = await Promise.all(filesContent.map(createBlobForFile(octo, org, repo)))

    // Step 4: Create new tree with new files
    const newTree = await createNewTree(
          octo,
          org,
          repo,
          filesBlobs,
          pathsForBlobs,
          currentCommit.treeSha
        )

    // Step 5: Create new commit
    const newCommit = await createNewCommit(
          octo,
          org,
          repo,
          commitMessage,
          newTree.sha,
          currentCommit.commitSha
        )

    // Step 6:  Push new commit to github
    await setBranchToCommit(octo, org, repo, branch, newCommit.sha)
}

export const getCurrentCommit = async (
    octo: Octokit,
    org: string,
    repo: string,
    branch: string = 'master'
) => {
    const { data: refData } = await octo.git.getRef({
          owner: org,
          repo,
          ref: `heads/${branch}`,
            })
    const commitSha = refData.object.sha
    const { data: commitData } = await octo.git.getCommit({
          owner: org,
          repo,
          commit_sha: commitSha,
        })
    return {
          commitSha,
          treeSha: commitData.tree.sha,
        }
}

export const createBlobForFile = (octo: Octokit, org: string, repo: string) => async (
    content: string
) => {
    const blobData = await octo.git.createBlob({
          owner: org,
          repo,
          content,
          encoding: 'utf-8',
        })
    return blobData.data
}

export const createNewTree = async (
    octo: Octokit,
    owner: string,
    repo: string,
    blobs,
    paths: string[],
    parentTreeSha: string
) => {
  const tree = blobs.map(({ sha }, index) => ({
        path: paths[index],
        mode: `100644`,
        type: `blob`,
        sha,
      }))
    const { data } = await octo.git.createTree({
          owner,
          repo,
          tree,
          base_tree: parentTreeSha,
        })
    return data
}

export const createNewCommit = async (
    octo: Octokit,
    org: string,
    repo: string,
    message: string,
    currentTreeSha: string,
    currentCommitSha: string
) =>
    (await octo.git.createCommit({
          owner: org,
          repo,
          message,
          tree: currentTreeSha,
          parents: [currentCommitSha],
        })).data

export const setBranchToCommit = (
    octo: Octokit,
    org: string,
    repo: string,
    branch: string = `master`,
    commitSha: string
) =>
    octo.git.updateRef({
          owner: org,
          repo,
          ref: `heads/${branch}`,
          sha: commitSha,
    })

