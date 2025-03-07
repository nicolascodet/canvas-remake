'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { DiscussionPost, DiscussionReply } from '@/lib/api';
import apiService from '@/lib/api';

export default function DiscussionsPage() {
  const params = useParams();
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<DiscussionPost | null>(null);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [newReply, setNewReply] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, [params.courseId]);

  const fetchDiscussions = async () => {
    try {
      const data = await apiService.getCourseDiscussions(params.courseId as string);
      setDiscussions(data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const fetchReplies = async (postId: string) => {
    try {
      const data = await apiService.getDiscussionReplies(postId);
      setReplies(data);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handlePostClick = async (post: DiscussionPost) => {
    setSelectedPost(post);
    await fetchReplies(post.id);
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createDiscussion(
        params.courseId as string,
        newDiscussion.title,
        newDiscussion.content
      );
      setNewDiscussion({ title: '', content: '' });
      setIsCreating(false);
      await fetchDiscussions();
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    try {
      await apiService.createReply(selectedPost.id, newReply);
      setNewReply('');
      await fetchReplies(selectedPost.id);
      await fetchDiscussions(); // Refresh discussions to update reply count
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Discussions</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          + Discussion
        </button>
      </div>

      {/* Create Discussion Form */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Discussion</h3>
              <button onClick={() => setIsCreating(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create Discussion
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Discussions List */}
        <div className="bg-white rounded-lg border">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              onClick={() => handlePostClick(discussion)}
              className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                selectedPost?.id === discussion.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-600">{discussion.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{discussion.content}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{discussion.replies_count} replies</span>
                    <span>By: {discussion.author}</span>
                    <span>
                      {new Date(discussion.created_at).toLocaleDateString()} 
                      {new Date(discussion.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Replies Section */}
        {selectedPost && (
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold">Replies to: {selectedPost.title}</h3>
            </div>
            <div className="p-4 space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="border-b last:border-b-0 pb-4">
                  <p className="text-sm text-gray-600">{reply.content}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>By: {reply.author}</span>
                    <span>
                      {new Date(reply.created_at).toLocaleDateString()} 
                      {new Date(reply.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}

              {/* Reply Form */}
              <form onSubmit={handleCreateReply} className="mt-4">
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="Write your reply..."
                  required
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Post Reply
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 