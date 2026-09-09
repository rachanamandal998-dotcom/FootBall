import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'

export default function News() {
  const { DB, saveData, showToast } = useData()

  const news = DB?.news || []

  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Club News',
    author: '',
    date: '',
    image: '',
    status: 'Published',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'Club News',
      author: '',
      date: '',
      image: '',
      status: 'Published',
    })

    setEditingNews(null)
    setShowForm(false)
  }

  const handleAdd = () => {
    setEditingNews(null)

    setForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'Club News',
      author: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      status: 'Published',
    })

    setShowForm(true)
  }

  const handleEdit = (item) => {
    setEditingNews(item)

    setForm({
      title: item.title || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || 'Club News',
      author: item.author || '',
      date: item.date || '',
      image: item.image || '',
      status: item.status || 'Published',
    })

    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      showToast('News title is required', 'err')
      return
    }

    if (!form.content.trim()) {
      showToast('News content is required', 'err')
      return
    }

    if (editingNews) {
      const updatedNews = news.map((item) =>
        item.id === editingNews.id
          ? {
              ...item,
              ...form,
            }
          : item
      )

      saveData({
        ...DB,
        news: updatedNews,
      })

      showToast('News updated successfully')
    } else {
      const newNews = {
        id: Date.now(),
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category,
        author: form.author.trim(),
        date:
          form.date || new Date().toISOString().split('T')[0],
        image: form.image.trim(),
        status: form.status,
      }

      saveData({
        ...DB,
        news: [newNews, ...news],
      })

      showToast('News created successfully')
    }

    resetForm()
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this news article?'
    )

    if (!confirmed) return

    saveData({
      ...DB,
      news: news.filter((item) => item.id !== id),
    })

    showToast('News deleted successfully')
  }

  const toggleStatus = (item) => {
    const newStatus =
      item.status === 'Published' ? 'Draft' : 'Published'

    const updatedNews = news.map((newsItem) =>
      newsItem.id === item.id
        ? {
            ...newsItem,
            status: newStatus,
          }
        : newsItem
    )

    saveData({
      ...DB,
      news: updatedNews,
    })

    showToast(
      newStatus === 'Published'
        ? 'News published'
        : 'News moved to draft'
    )
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[#123B2A]">
            News
          </h1>

          <p className="mt-2 text-gray-600">
            Create and manage Sindhuli Football Club news.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-[#123B2A] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#1E7245]"
        >
          + Add News
        </button>

      </div>

      {/* News Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">

          <h2 className="text-xl font-bold text-[#123B2A] mb-5">
            {editingNews ? 'Edit News' : 'Create News'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  News Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Sindhuli FC wins local championship"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="Club News">Club News</option>
                  <option value="Match Report">Match Report</option>
                  <option value="Player News">Player News</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Author
                </label>

                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Example: SFC Media Team"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Publication Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Featured Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/news-image.jpg"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Excerpt */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Short Description
                </label>

                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Short summary of the news..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Content */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Full Article *
                </label>

                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows="10"
                  placeholder="Write the full news article here..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="bg-[#1E7245] text-white px-5 py-3 rounded-lg font-semibold"
              >
                {editingNews ? 'Update News' : 'Publish News'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 px-5 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* News List */}
      <div className="space-y-4">

        {news.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <h2 className="text-xl font-semibold text-[#123B2A]">
              No news articles yet
            </h2>

            <p className="text-gray-500 mt-2">
              Click "Add News" to create your first article.
            </p>

          </div>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >

              <div className="flex flex-col md:flex-row gap-5">

                {/* Image */}
                {item.image && (
                  <div className="w-full md:w-48 h-32 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">

                  <div className="flex flex-wrap gap-2 mb-2">

                    <span className="bg-[#E8F3EC] text-[#123B2A] px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category || 'Club News'}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.status || 'Draft'}
                    </span>

                  </div>

                  <h2 className="text-xl font-bold text-[#123B2A]">
                    {item.title}
                  </h2>

                  {item.excerpt && (
                    <p className="text-gray-600 mt-2">
                      {item.excerpt}
                    </p>
                  )}

                  <div className="text-sm text-gray-500 mt-3">
                    {item.author && (
                      <span>{item.author}</span>
                    )}

                    {item.author && item.date && (
                      <span> • </span>
                    )}

                    {item.date && (
                      <span>{item.date}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">

                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="border border-[#1E7245] text-[#1E7245] px-4 py-2 rounded-lg font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleStatus(item)}
                      className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-semibold"
                    >
                      {item.status === 'Published'
                        ? 'Move to Draft'
                        : 'Publish'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="border border-red-500 text-red-500 px-4 py-2 rounded-lg font-semibold"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  )
}